import os
import uuid
import datetime
import threading
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

from .config import settings
from .database import get_db
from .init_db import init_db
from . import models, schemas, tasks
from . import oauth as oauth_service
from .mfa import generate_totp_secret, get_totp_uri, verify_totp_code
from .threat_intel import (
    get_integration_setting,
    validate_virustotal_api_key,
    validate_otx_api_key,
    lookup_hash_intel,
    lookup_indicator_intel,
)

# Auth Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

app = FastAPI(title="ForensiGuard API", version="1.0.0")

# Enable CORS for frontend API communications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    print("[*] Initializing databases schemas...")
    init_db()


@app.get("/health")
def health_check():
    return {"status": "ok"}

# HELPER: JWT token generator
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# HELPER: Get current logged-in analyst
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise credentials_exception
    return user


def is_super_admin(user: models.User) -> bool:
    return user.role == "SuperAdmin"


def same_organization(user: models.User, target: models.User) -> bool:
    if user.account_type != "enterprise" or target.account_type != "enterprise":
        return False
    return bool(user.organization_name and target.organization_name and user.organization_name == target.organization_name)


def assert_same_org_or_super_admin(target_user: models.User, current_user: models.User):
    if is_super_admin(current_user):
        return
    if current_user.account_type == "enterprise":
        if not same_organization(current_user, target_user):
            raise HTTPException(
                status_code=403,
                detail="Opération interdite. Cet utilisateur n'appartient pas à votre organisation.",
            )
    # non-enterprise Admins are allowed to manage all local users by design


def assert_org_access_or_super_admin(resource_org: Optional[str], current_user: models.User):
    if is_super_admin(current_user):
        return
    if current_user.account_type == "enterprise":
        if not resource_org or resource_org != current_user.organization_name:
            raise HTTPException(
                status_code=403,
                detail="Opération interdite. Cette ressource n'appartient pas à votre organisation.",
            )


# HELPER: RBAC role verification
def require_role(allowed_roles: List[str]):
    def dependency(current_user: models.User = Depends(get_current_user)):
        if not is_super_admin(current_user) and current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="Operation prohibited. Insufficient RBAC clearance level."
            )
        return current_user
    return dependency

def _dispatch_yara_scan(job_id: str, filepath: str) -> None:
    """Queue a scan via Celery when enabled, otherwise run in a daemon thread."""
    def run_scan() -> None:
        try:
            tasks.compute_hashes_and_yara_scan(job_id, filepath)
        except Exception as exc:
            print(f"[!] Background scan failed for job {job_id}: {exc}")

    if settings.ENABLE_CELERY_WORKER and tasks.celery_app is not None:
        try:
            tasks.compute_hashes_and_yara_scan.delay(job_id, filepath)
            return
        except Exception as exc:
            print(f"[!] Celery dispatch failed, using background thread: {exc}")

    threading.Thread(target=run_scan, daemon=True).start()

def log_activity(
    db: Session,
    user_id: int,
    action_type: str,
    title: str,
    description: Optional[str] = None,
    resource_id: Optional[str] = None,
    extra_data: Optional[Dict[str, Any]] = None,
):
    entry = models.ActivityHistory(
        user_id=user_id,
        action_type=action_type,
        title=title,
        description=description,
        resource_id=resource_id,
        extra_data=extra_data or {},
    )
    db.add(entry)
    db.commit()

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        audit = models.AuditLog(
            user_email=request.email,
            action="LOGIN_FAILURE",
            resource="Credentials authentication",
            status="failure"
        )
        db.add(audit)
        db.commit()
        raise HTTPException(status_code=400, detail="E-mail ou mot de passe incorrect.")

    if not user.password_hash or not pwd_context.verify(request.password, user.password_hash):
        audit = models.AuditLog(
            user_email=request.email,
            action="LOGIN_FAILURE",
            resource="Credentials authentication",
            status="failure",
            organization_name=None
        )
        db.add(audit)
        db.commit()
        raise HTTPException(status_code=400, detail="E-mail ou mot de passe incorrect.")

    if user.mfa_enabled:
        if not request.mfa_code:
            raise HTTPException(status_code=402, detail="Code MFA requis.")
        if not user.mfa_secret or not verify_totp_code(user.mfa_secret, request.mfa_code):
            raise HTTPException(status_code=400, detail="Code d'authentification multi-facteurs invalide.")

    token = create_access_token({"sub": user.email, "role": user.role})
    user.last_login = datetime.datetime.utcnow()
    
    # Audit success entry
    audit = models.AuditLog(
        user_email=user.email,
        action="LOGIN_SUCCESS",
        resource="Session Token Generated",
        status="success",
        organization_name=user.organization_name if user.account_type == "enterprise" else None
    )
    db.add(audit)
    db.commit()

    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/mfa/setup")
def mfa_setup(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="L'authentification à deux facteurs est déjà activée.")
    secret = generate_totp_secret()
    current_user.mfa_secret = secret
    db.commit()
    db.refresh(current_user)
    return {
        "secret": secret,
        "otpauth_uri": get_totp_uri(secret, current_user.email),
    }


class MfaEnableRequest(BaseModel):
    code: str


@app.post("/api/auth/mfa/enable")
def mfa_enable(request: MfaEnableRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="L'authentification à deux facteurs est déjà activée.")
    if not current_user.mfa_secret:
        raise HTTPException(status_code=400, detail="Aucun secret TOTP n'est configuré. Démarrez la configuration 2FA d'abord.")
    if not verify_totp_code(current_user.mfa_secret, request.code):
        raise HTTPException(status_code=400, detail="Code d'authentification multi-facteurs invalide.")
    current_user.mfa_enabled = True
    db.commit()
    return {"status": "success", "detail": "2FA activé."}


@app.post("/api/auth/mfa/disable")
def mfa_disable(request: MfaEnableRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="L'authentification à deux facteurs n'est pas activée.")
    if not current_user.mfa_secret or not verify_totp_code(current_user.mfa_secret, request.code):
        raise HTTPException(status_code=400, detail="Code d'authentification multi-facteurs invalide.")
    current_user.mfa_enabled = False
    db.commit()
    return {"status": "success", "detail": "2FA désactivé."}


@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(request: schemas.UserRegister, db: Session = Depends(get_db)):
    if request.account_type not in ("professional", "enterprise"):
        raise HTTPException(status_code=400, detail="Type de compte invalide.")
    if request.account_type == "enterprise" and not (request.organization_name or "").strip():
        raise HTTPException(status_code=400, detail="Le nom de l'organisation est requis pour un compte Entreprise.")

    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Impossible de créer le compte. Vérifiez vos informations ou connectez-vous.",
        )
    
    hashed_pw = pwd_context.hash(request.password)
    default_role = "Analyst" if request.account_type == "professional" else "Admin"
    user = models.User(
        name=request.name,
        email=request.email,
        password_hash=hashed_pw,
        oauth_provider=None,
        oauth_subject=None,
        role=default_role,
        account_type=request.account_type,
        organization_name=request.organization_name.strip() if request.organization_name else None,
        mfa_enabled=False,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/api/auth/oauth/{provider}/authorize", response_model=schemas.OAuthAuthorizeResponse)
def oauth_authorize(provider: str, redirect_uri: str):
    try:
        return oauth_service.get_oauth_authorization_url(provider, redirect_uri)
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/api/auth/oauth/callback", response_model=schemas.Token)
def oauth_callback(request: schemas.OAuthCallbackRequest, db: Session = Depends(get_db)):
    if not oauth_service.verify_oauth_state(request.state, request.provider):
        raise HTTPException(status_code=400, detail="État OAuth invalide ou expiré.")

    try:
        profile = oauth_service.exchange_oauth_code(
            request.provider,
            request.code,
            request.redirect_uri,
        )
        user = oauth_service.upsert_oauth_user(db, profile)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Impossible de finaliser la connexion OAuth. Réessayez.",
        ) from exc

    if user.mfa_enabled:
        raise HTTPException(
            status_code=400,
            detail="Les comptes MFA doivent utiliser la connexion par e-mail.",
        )

    token = create_access_token({"sub": user.email, "role": user.role})
    audit = models.AuditLog(
        user_email=user.email,
        action="LOGIN_SUCCESS",
        resource=f"OAuth {request.provider}",
        status="success",
        organization_name=user.organization_name if user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()
    return {"access_token": token, "token_type": "bearer"}

# --- INCIDENTS ENDPOINTS ---

@app.get("/api/incidents", response_model=List[schemas.IncidentResponse])
def get_incidents(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Incident)
    if current_user.account_type == "enterprise" and not is_super_admin(current_user):
        query = query.filter(models.Incident.organization_name == current_user.organization_name)
    return query.all()

@app.post("/api/incidents", response_model=schemas.IncidentResponse)
def create_incident(inc: schemas.IncidentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst", "Responder"]))):
    new_id = f"INC-2026-00{db.query(models.Incident).count() + 1}"
    new_inc = models.Incident(
        id=new_id,
        title=inc.title,
        severity=inc.severity,
        status="open",
        owner_id=current_user.id,
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
        description=inc.description
    )
    db.add(new_inc)
    db.commit()
    db.refresh(new_inc)

    # Log audit trail
    audit = models.AuditLog(
        user_email=current_user.email,
        action="INCIDENT_CREATE",
        resource=new_id,
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()

    log_activity(
        db,
        current_user.id,
        "incident",
        f"Incident créé : {new_id}",
        description=inc.title,
        resource_id=new_id,
    )

    return new_inc

@app.get("/api/incidents/{incident_id}", response_model=schemas.IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    inc = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident introuvable.")
    assert_org_access_or_super_admin(inc.organization_name, current_user)
    return inc

@app.patch("/api/incidents/{incident_id}", response_model=schemas.IncidentResponse)
def update_incident(
    incident_id: str,
    update: schemas.IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["Admin", "Analyst", "Responder"])),
):
    inc = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident introuvable.")
    assert_org_access_or_super_admin(inc.organization_name, current_user)

    if update.status is not None:
        inc.status = update.status
        if update.status == "resolved":
            inc.closed_at = datetime.datetime.utcnow()
    if update.severity is not None:
        inc.severity = update.severity
    if update.owner_id is not None:
        inc.owner_id = update.owner_id
    if update.description is not None:
        inc.description = update.description

    db.commit()
    db.refresh(inc)

    audit = models.AuditLog(
        user_email=current_user.email,
        action="INCIDENT_UPDATE",
        resource=incident_id,
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()

    log_activity(
        db,
        current_user.id,
        "incident",
        f"Incident mis à jour : {incident_id}",
        description=f"Statut : {inc.status}, Sévérité : {inc.severity}",
        resource_id=incident_id,
    )
    return inc

# --- EVIDENCE & CHAIN OF CUSTODY ENDPOINTS ---

@app.get("/api/evidence", response_model=List[schemas.EvidenceResponse])
def get_evidence(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Evidence)
    if current_user.account_type == "enterprise" and not is_super_admin(current_user):
        query = query.filter(models.Evidence.organization_name == current_user.organization_name)
    return query.all()

@app.post("/api/evidence", response_model=schemas.EvidenceResponse)
def register_evidence(ev: schemas.EvidenceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst", "Responder"]))):
    new_id = f"EVID-90{db.query(models.Evidence).count() + 21}"
    new_ev = models.Evidence(
        id=new_id,
        name=ev.name,
        category=ev.category,
        collector=current_user.name,
        sha256_hash=ev.sha256_hash,
        custodian=current_user.name,
        location=ev.location,
        verified=True,
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None
    )
    db.add(new_ev)
    
    # Setup initial custody history
    history = models.CustodyHistory(
        evidence_id=new_id,
        transfer_from=f"Acquisition ({ev.category})",
        transfer_to=current_user.name,
        action_taken="Initial acquisition & cryptographic hashing"
    )
    db.add(history)
    db.commit()
    db.refresh(new_ev)

    # Log audit entry
    audit = models.AuditLog(
        user_email=current_user.email,
        action="EVIDENCE_REGISTER",
        resource=new_id,
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None
    )
    db.add(audit)
    db.commit()

    log_activity(
        db,
        current_user.id,
        "evidence",
        f"Preuve enregistrée : {new_id}",
        description=ev.name,
        resource_id=new_id,
    )

    return new_ev

@app.post("/api/evidence/{id}/transfer", response_model=schemas.EvidenceResponse)
def transfer_custody(id: str, transfer: schemas.CustodyTransfer, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst", "Responder"]))):
    ev = db.query(models.Evidence).filter(models.Evidence.id == id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence material not found")

    old_custodian = ev.custodian
    ev.custodian = transfer.transfer_to

    history = models.CustodyHistory(
        evidence_id=id,
        transfer_from=old_custodian,
        transfer_to=transfer.transfer_to,
        action_taken=transfer.action_taken
    )
    db.add(history)
    db.commit()
    db.refresh(ev)

    # Log audit entry
    audit = models.AuditLog(
        user_email=current_user.email,
        action="EVIDENCE_TRANSFER",
        resource=f"{id} | From {old_custodian} to {transfer.transfer_to}",
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()

    return ev

import tempfile

@app.get("/api/evidence/{id}/report")
def get_evidence_pdf_report(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ev = db.query(models.Evidence).filter(models.Evidence.id == id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence material not found")
    assert_org_access_or_super_admin(ev.organization_name, current_user)

    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"forensiguard_report_{id}.pdf")
    
    # Generate PDF Report (can run synchronously for quick small items)
    tasks.generate_pdf_report(id, output_path)

    # Check if file created
    if not os.path.exists(output_path):
        raise HTTPException(status_code=500, detail="PDF generation failed")

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename=f"ForensiGuard_Report_{id}.pdf"
    )

# --- TIMELINE ENDPOINTS ---

@app.get("/api/timeline", response_model=List[schemas.TimelineEventResponse])
def get_timeline(incident_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident introuvable.")
    assert_org_access_or_super_admin(incident.organization_name, current_user)
    return db.query(models.TimelineEvent).filter(models.TimelineEvent.incident_id == incident_id).order_by(models.TimelineEvent.timestamp.desc()).all()

@app.post("/api/timeline", response_model=schemas.TimelineEventResponse)
def add_timeline_event(event: schemas.TimelineEventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst", "Responder"]))):
    incident = db.query(models.Incident).filter(models.Incident.id == event.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident introuvable.")
    assert_org_access_or_super_admin(incident.organization_name, current_user)
    new_event = models.TimelineEvent(
        incident_id=event.incident_id,
        category=event.category,
        title=event.title,
        details=event.details,
        source=event.source,
        importance=event.importance
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    log_activity(
        db,
        current_user.id,
        "timeline",
        f"Événement ajouté : {event.title}",
        description=f"Incident {event.incident_id}",
        resource_id=str(new_event.id),
        extra_data={"incident_id": event.incident_id},
    )

    return new_event

# --- AUDIT LOGS ENDPOINTS ---

@app.get("/api/audit", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin"]))):
    query = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc())
    if not is_super_admin(current_user) and current_user.account_type == "enterprise":
        query = query.filter(models.AuditLog.organization_name == current_user.organization_name)
    return query.all()

# --- THREAT INTEL INTEGRATIONS ---

def upsert_integration_setting(db: Session, name: str, api_key: Optional[str]):
    setting = get_integration_setting(db, name)
    if setting is None:
        setting = models.IntegrationSetting(name=name, api_key=api_key)
        db.add(setting)
    else:
        setting.api_key = api_key
    db.commit()
    db.refresh(setting)
    return setting


def get_integration_flags(db: Session) -> Dict[str, bool]:
    return {
        "virustotal_configured": bool(get_integration_setting(db, "virustotal") and get_integration_setting(db, "virustotal").api_key),
        "otx_configured": bool(get_integration_setting(db, "otx") and get_integration_setting(db, "otx").api_key),
    }


@app.get("/api/integrations", response_model=schemas.IntegrationSettingsResponse)
def get_integration_settings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return get_integration_flags(db)


@app.post("/api/integrations", response_model=schemas.IntegrationSettingsResponse)
def save_integration_settings(request: schemas.IntegrationSettingsUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst"]))):
    if request.virustotal_api_key is not None:
        upsert_integration_setting(db, "virustotal", request.virustotal_api_key.strip() or None)
    if request.otx_api_key is not None:
        upsert_integration_setting(db, "otx", request.otx_api_key.strip() or None)
    return get_integration_flags(db)


@app.post("/api/integrations/validate", response_model=schemas.ThreatIntelResponse)
def validate_integration_keys(request: schemas.IntegrationSettingsUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin", "Analyst"]))):
    messages: List[str] = []
    vt_setting = get_integration_setting(db, "virustotal")
    otx_setting = get_integration_setting(db, "otx")
    virustotal_key = request.virustotal_api_key if request.virustotal_api_key is not None else getattr(vt_setting, "api_key", None)
    otx_key = request.otx_api_key if request.otx_api_key is not None else getattr(otx_setting, "api_key", None)

    virustotal_result = None
    otx_result = None

    if virustotal_key:
        try:
            virustotal_result = validate_virustotal_api_key(virustotal_key)
            messages.append("VirusTotal key validated successfully.")
        except Exception as exc:
            messages.append(f"VirusTotal validation failed: {str(exc)}")
    else:
        messages.append("VirusTotal key is not configured.")

    if otx_key:
        try:
            otx_result = validate_otx_api_key(otx_key)
            messages.append("AlienVault OTX key validated successfully.")
        except Exception as exc:
            messages.append(f"OTX validation failed: {str(exc)}")
    else:
        messages.append("AlienVault OTX key is not configured.")

    return {
        "virustotal": virustotal_result,
        "otx": otx_result,
        "messages": messages,
    }


@app.post("/api/intel/hash", response_model=schemas.ThreatIntelResponse)
def lookup_hash_intel_endpoint(request: schemas.ThreatIntelHashLookup, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    virustotal_result, otx_result, messages = lookup_hash_intel(db, request.sha256_hash)
    log_activity(
        db,
        current_user.id,
        "intel",
        f"Recherche hash : {request.sha256_hash[:16]}…",
        description="; ".join(messages[:3]) if messages else None,
        resource_id=request.sha256_hash,
        extra_data={"indicator_type": "hash"},
    )
    return {
        "virustotal": virustotal_result,
        "otx": otx_result,
        "messages": messages,
    }


@app.post("/api/intel/lookup", response_model=schemas.ThreatIntelResponse)
def lookup_indicator_endpoint(request: schemas.ThreatIntelLookup, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    virustotal_result, otx_result, messages = lookup_indicator_intel(db, request.indicator, request.indicator_type)
    log_activity(
        db,
        current_user.id,
        "intel",
        f"Recherche {request.indicator_type} : {request.indicator[:80]}",
        description="; ".join(messages[:3]) if messages else None,
        resource_id=request.indicator,
        extra_data={"indicator_type": request.indicator_type},
    )
    return {
        "virustotal": virustotal_result,
        "otx": otx_result,
        "messages": messages,
    }


# --- YARA TRIAGE SCANS ENDPOINTS ---

@app.post("/api/yara/scan", response_model=schemas.YaraJobResponse)
def trigger_yara_scan(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job_id = str(uuid.uuid4())
    
    # Store file locally
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    # Create DB entry
    job = models.YaraJob(
        id=job_id,
        user_id=current_user.id,
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
        filepath=filepath,
        status="pending"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    _dispatch_yara_scan(job_id, filepath)

    # Log audit entry
    audit = models.AuditLog(
        user_email=current_user.email,
        action="YARA_SCAN_TRIGGER",
        resource=f"Job ID: {job_id} | File: {file.filename}",
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()

    log_activity(
        db,
        current_user.id,
        "scan",
        f"Analyse YARA : {file.filename}",
        description=f"Job {job_id}",
        resource_id=job_id,
        extra_data={"filename": file.filename},
    )

    return job

@app.get("/api/yara/job/{id}", response_model=schemas.YaraJobResponse)
def get_yara_job(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.YaraJob).filter(models.YaraJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="YARA scan job not found")
    assert_org_access_or_super_admin(job.organization_name, current_user)
    return job

# --- USER MANAGEMENT & PROFILE ENDPOINTS ---

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/api/auth/me", response_model=schemas.UserResponse)
def update_me(
    request: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if request.name is not None:
        current_user.name = request.name.strip()
    if request.organization_name is not None and current_user.account_type == "enterprise":
        current_user.organization_name = request.organization_name.strip() or None
    if request.onboarding_completed is not None:
        current_user.onboarding_completed = request.onboarding_completed
    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/api/auth/change-password")
def change_password(
    request: schemas.PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not current_user.password_hash:
        raise HTTPException(status_code=400, detail="Ce compte n'a pas de mot de passe local configuré.")
    if not pwd_context.verify(request.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect.")
    if len(request.new_password) < 8:
        raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit contenir au moins 8 caractères.")
    current_user.password_hash = pwd_context.hash(request.new_password)
    db.commit()
    audit = models.AuditLog(
        user_email=current_user.email,
        action="PASSWORD_CHANGE",
        resource="User account",
        status="success",
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "detail": "Mot de passe mis à jour."}

@app.get("/api/history", response_model=List[schemas.ActivityHistoryResponse])
def get_activity_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.ActivityHistory)
        .filter(models.ActivityHistory.user_id == current_user.id)
        .order_by(models.ActivityHistory.created_at.desc())
        .limit(min(limit, 200))
        .all()
    )

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin"]))):
    query = db.query(models.User)
    if not is_super_admin(current_user) and current_user.account_type == "enterprise":
        query = query.filter(models.User.organization_name == current_user.organization_name)
    return query.all()

class RoleUpdateRequest(schemas.BaseModel):
    role: str

@app.put("/api/users/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(user_id: int, request: RoleUpdateRequest, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin"]))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
    assert_same_org_or_super_admin(user, current_user)
    user.role = request.role
    db.commit()
    db.refresh(user)
    return user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin"]))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot revoke your own active admin session")
    assert_same_org_or_super_admin(user, current_user)
    db.delete(user)
    db.commit()
    return {"status": "success", "detail": "User account revoked successfully"}

@app.post("/api/users", response_model=schemas.UserResponse)
def create_invited_user(new_user: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["Admin"]))):
    existing = db.query(models.User).filter(models.User.email == new_user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="A user with this email address already exists")
    
    hashed_pw = pwd_context.hash(new_user.password)
    user = models.User(
        name=new_user.name,
        email=new_user.email,
        password_hash=hashed_pw,
        role=new_user.role,
        account_type=current_user.account_type,
        organization_name=current_user.organization_name if current_user.account_type == "enterprise" else None,
        mfa_enabled=False,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

