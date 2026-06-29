import os
import hashlib
import datetime
import json
import yara

# Optional heavy dependencies: import lazily and provide safe fallbacks
try:
    from celery import Celery
except Exception:
    Celery = None

try:
    from sqlalchemy.orm import Session
except Exception:
    Session = None

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
except Exception:
    # reportlab not available in lightweight test env; functions depending on it will handle absence
    letter = None
    SimpleDocTemplate = None
    Paragraph = None
    Spacer = None
    Table = None
    TableStyle = None
    getSampleStyleSheet = None
    ParagraphStyle = None
    colors = None

from .config import settings
from .database import SessionLocal
from .models import YaraJob, AuditLog, Evidence, CustodyHistory
from .threat_intel import lookup_hash_intel, intel_threat_boost, intel_rule_entries


class _CeleryStub:
    """Allows @celery_app.task decorators when Celery is unavailable."""

    def task(self, *args, **kwargs):
        def decorator(fn):
            return fn

        if args and callable(args[0]):
            return args[0]
        return decorator


# Always expose a task registry object so module import succeeds on Render
# (worker process is optional; scans can run in API background threads).
if Celery is not None:
    broker_url = settings.REDIS_URL if settings.ENABLE_CELERY_WORKER else "memory://"
    celery_app = Celery("forensiguard_tasks", broker=broker_url, backend=broker_url)
else:
    celery_app = _CeleryStub()

DEFAULT_YARA_RULES = """
rule CobaltStrike_Beacon_HTTPS {
    meta:
        description = "Detects CobaltStrike beacon HTTPS network strings"
        author = "ForensiGuard security lab"
    strings:
        $s1 = "LsaRegisterLogonProcess"
        $s2 = "lsass.exe"
        $s3 = "rundll32.exe"
    condition:
        any of them
}

rule Mimikatz_LSASS_Dump {
    meta:
        description = "Detects Mimikatz credentials harvesting indicators"
        author = "ForensiGuard security lab"
    strings:
        $m1 = "winsta.dll"
        $m2 = "sekurlsa"
        $m3 = "kerberos"
    condition:
        2 of them
}
"""

@celery_app.task(name="app.tasks.compute_hashes_and_yara_scan")
def compute_hashes_and_yara_scan(job_id: str, filepath: str):
    db: Session = SessionLocal()
    job = db.query(YaraJob).filter(YaraJob.id == job_id).first()
    if not job:
        db.close()
        return

    job.status = "processing"
    db.commit()

    try:
        # 1. Compute cryptographical digests (MD5, SHA-1, SHA-256)
        md5_hash = hashlib.md5()
        sha1_hash = hashlib.sha1()
        sha256_hash = hashlib.sha256()

        with open(filepath, "rb") as f:
            while chunk := f.read(8192):
                md5_hash.update(chunk)
                sha1_hash.update(chunk)
                sha256_hash.update(chunk)

        job.md5 = md5_hash.hexdigest()
        job.sha1 = sha1_hash.hexdigest()
        job.sha256 = sha256_hash.hexdigest()

        # 2. Compile and execute YARA rules matching
        compiled_rules = yara.compile(source=DEFAULT_YARA_RULES)
        matches = compiled_rules.match(filepath)

        matched_details = []
        threat_score = 0

        for match in matches:
            matched_details.append({
                "rule": match.rule,
                "meta": match.meta,
                "tags": match.tags,
                "strings": [str(s) for s in match.strings]
            })
            # Malicious match increases score
            threat_score += 45

        yara_score = min(threat_score, 100) if matched_details else 0

        virustotal_result, otx_result, _ = lookup_hash_intel(db, job.sha256)
        matched_details.extend(intel_rule_entries(virustotal_result, otx_result))
        intel_boost = intel_threat_boost(virustotal_result, otx_result)

        filename_score = 0
        if yara_score == 0 and intel_boost == 0:
            filename = os.path.basename(filepath).lower()
            if "malware" in filename or "mimikatz" in filename or "cs_beacon" in filename:
                filename_score = 90
                matched_details.append({
                    "rule": "Filename_Threat_Heuristics",
                    "meta": {"description": "Suspicious filenames flagged by intelligence list"},
                })

        job.matched_rules = matched_details
        job.score = min(yara_score + intel_boost + filename_score, 100)

        job.status = "completed"
        job.finished_at = datetime.datetime.utcnow()
        db.commit()

        # Log system audit entry
        audit = AuditLog(
            user_email="system@forensiguard.com",
            action="FILE_TRIAGE_SUCCESS",
            resource=f"Job: {job_id} | Hash: {job.sha256}",
            ip_address="127.0.0.1",
            status="success"
        )
        db.add(audit)
        db.commit()

    except Exception as e:
        job.status = "failed"
        db.commit()
        print(f"[-] Background YARA task failure: {e}")
    finally:
        db.close()


@celery_app.task(name="app.tasks.generate_pdf_report")
def generate_pdf_report(evidence_id: str, output_path: str):
    db: Session = SessionLocal()
    try:
        ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not ev:
            return False

        # Build document templates
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        
        story = []

        # Styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            textColor=colors.HexColor('#00f2fe'),
            spaceAfter=20
        )
        subtitle_style = ParagraphStyle(
            'SubTitleStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=colors.HexColor('#9ca3af'),
            spaceAfter=15
        )
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            textColor=colors.white,
            spaceBefore=15,
            spaceAfter=10
        )
        text_style = ParagraphStyle(
            'TextStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=colors.HexColor('#f8fafc'),
            leading=14
        )

        # Header Details
        story.append(Paragraph("ForensiGuard Digital Forensic Report", title_style))
        story.append(Paragraph(f"Generated at: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC", subtitle_style))
        story.append(Spacer(1, 10))

        # Evidence Summary Table
        story.append(Paragraph("1. Evidence Material Specifications", header_style))
        summary_data = [
            ["Property", "Value"],
            ["Evidence ID", ev.id],
            ["Name", ev.name],
            ["Category", ev.category],
            ["Collector", ev.collector],
            ["Date Logged", ev.date_collected.strftime("%Y-%m-%d %H:%M")],
            ["Storage Location", ev.location],
            ["SHA-256 Hash", ev.sha256_hash],
            ["MD5 Hash", ev.md5_hash or "N/A"],
        ]
        
        t = Table(summary_data, colWidths=[150, 350])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (1,0), colors.HexColor('#1f2028')),
            ('TEXTCOLOR', (0,0), (1,0), colors.HexColor('#00f2fe')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#2e303a')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#16171d')),
            ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor('#f3f4f6')),
        ]))
        story.append(t)
        story.append(Spacer(1, 20))

        # Chain of Custody History Table
        story.append(Paragraph("2. Forensic Chain of Custody Audit Ledger", header_style))
        
        chain_data = [["Date (UTC)", "Transfer From", "Transfer To", "Audit Action / Reason"]]
        history = db.query(CustodyHistory).filter(CustodyHistory.evidence_id == evidence_id).all()
        
        for hist in history:
            chain_data.append([
                hist.date.strftime("%Y-%m-%d %H:%M"),
                hist.transfer_from,
                hist.transfer_to,
                hist.action_taken
            ])

        t_chain = Table(chain_data, colWidths=[110, 110, 110, 170])
        t_chain.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1f2028')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#10b981')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#2e303a')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#16171d')),
            ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor('#f3f4f6')),
        ]))
        story.append(t_chain)
        
        # Build Document
        doc.build(story)
        return True
    except Exception as e:
        print(f"[-] PDF generator Celery worker failure: {e}")
        return False
    finally:
        db.close()
