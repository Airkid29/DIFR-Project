// REPORT PAGE
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import { exportForensicPdf } from "../utils/pdfExport";

export default function Report() {
  const navigate = useNavigate();

  const handleBackToScanner = () => navigate('/analysis');
  const handleAddToEvidence = () => navigate('/evidence');

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24, maxWidth: 900, margin: "0 auto" },
    backLink: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9CA3AF", cursor: "pointer", marginBottom: 12 },
    header: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" },
    headerLeft: { display: "flex", alignItems: "center", gap: 16 },
    headerIcon: { width: 48, height: 48, background: "rgba(59, 130, 246, 0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" },
    headerInfo: { display: "flex", flexDirection: "column" as const, gap: 4 },
    headerTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB" },
    headerSub: { fontSize: 10, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 },
    headerButtons: { display: "flex", gap: 12 },
    btn: { padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    btnPrimary: { background: "#FFFFFF", color: "#0A0E1A", border: "none" },
    metricsGrid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 },
    card: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" as const, gap: 12 },
    cardTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 16 },
    threatBox: { display: "flex", alignItems: "center", gap: 16 },
    threatIcon: { width: 40, height: 40 },
    threatInfo: { flex: 1 },
    threatScore: { fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const },
    hashBox: { background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", wordBreak: "break-all" as const, marginTop: 4 }
  };

  const handleExportPdf = () => {
    exportForensicPdf({
      title: "Forensic Investigation Report",
      fileName: "suspicious_payload.exe",
      fileSize: "420 KB",
      threatScore: 85,
      severity: "Malicious Artifact",
      hashes: {
        md5: "3a42d9f86d081884c7d659a2feaa0c55",
        sha1: "fa328b9d0b8db2d128ea73e823b8db2d128ee5d0",
        sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
      },
      signatures: ["Malware_Suspicious_Strings", "Packing_Detected"],
      notes: ["Suspicious strings matched in the artifact preview.", "Execution chain indicates possible lateral movement behavior."],
      custody: [
        "2026-06-29 09:15 - Analyst A collected the artifact from endpoint E-17",
        "2026-06-29 09:22 - Hash values generated and documented",
        "2026-06-29 09:30 - Report exported and attached to the evidence package"
      ]
    });
  };

  return (
    <div style={s.container}>
      <button type="button" style={{ ...s.backLink, background: 'none', border: 'none' }} onClick={handleBackToScanner}>← Back to Scanner</button>

      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}>
            <FileText size={24} />
          </div>
          <div style={s.headerInfo}>
            <h1 style={s.headerTitle}>suspicious_payload.exe</h1>
            <p style={s.headerSub}>Size: 420 KB | Triage Report</p>
          </div>
        </div>
        <div style={s.headerButtons}>
          <button style={s.btn} onClick={handleExportPdf}>
            <Download size={14} />
            <span>Download PDF</span>
          </button>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={handleAddToEvidence}>
            <span>Add to Evidence</span>
          </button>
        </div>
      </div>

      <div style={s.metricsGrid}>
        <div style={s.card}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 16 }}>Threat Level</span>
          <div style={s.threatBox}>
            <AlertTriangle size={40} style={{ color: "#EF4444" }} />
            <div>
              <div style={{ ...s.threatScore, color: "#EF4444" }}>85%</div>
              <span style={{ ...s.badge, background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                Malicious Artifact
              </span>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>Digital Hashes</h3>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>MD5</span>
              <div style={s.hashBox}>3a42d9f86d081884c7d659a2feaa0c55</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>SHA-1</span>
              <div style={s.hashBox}>fa328b9d0b8db2d128ea73e823b8db2d128ee5d0</div>
            </div>
            <div>
              <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>SHA-256</span>
              <div style={s.hashBox}>9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>YARA Signatures Matched</h3>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {["Malware_Suspicious_Strings", "Packing_Detected"].map((rule) => (
            <div key={rule} style={{ background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#EF4444", marginBottom: 8 }}>{rule}</div>
              <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>Source: local_ruleset.yar | Matched strings at offset 0x2f14, 0x3d0c</p>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>Digital Chain of Custody</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <ShieldCheck size={16} style={{ color: "#10B981" }} />
          <span style={{ fontSize: 12, color: "#F9FAFB", fontWeight: 600 }}>Evidence package verified and sealed</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {[
            "Collected by Analyst A on endpoint E-17",
            "Hash values archived and signed",
            "Report attached to chain-of-custody record"
          ].map((item) => (
            <div key={item} style={{ background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, padding: 10, fontSize: 11, color: "#9CA3AF" }}>{item}</div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>Threat Intelligence Analysis</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>VirusTotal</span>
            <p style={{ fontSize: 16, fontWeight: 900, color: "#EF4444", marginTop: 8 }}>54/72</p>
          </div>
          <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>AlienVault OTX</span>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B", marginTop: 8 }}>Malicious</p>
          </div>
          <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Local Cache</span>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#10B981", marginTop: 8 }}>Known</p>
          </div>
        </div>
      </div>
    </div>
  );
}