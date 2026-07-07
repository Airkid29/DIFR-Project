// REPORT PAGE
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, AlertTriangle, ShieldCheck } from "lucide-react";
import { exportForensicPdf } from "../utils/pdfExport";
import { t } from "../i18n";

export default function Report() {
  const navigate = useNavigate();

  const handleBackToScanner = () => navigate("/analysis");
  const handleAddToEvidence = () => navigate("/evidence");

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24, maxWidth: 900, margin: "0 auto" },
    backLink: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--brand-text-secondary)", cursor: "pointer", marginBottom: 12 },
    header: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 },
    headerLeft: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
    headerIcon: { width: 48, height: 48, background: "var(--theme-white-bg-tint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-cyan)" },
    headerInfo: { display: "flex", flexDirection: "column" as const, gap: 4 },
    headerTitle: { fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 18, color: "var(--brand-text-primary)" },
    headerSub: { fontSize: 10, color: "var(--brand-text-secondary)", fontFamily: "var(--font-mono)", marginTop: 4 },
    headerButtons: { display: "flex", gap: 12, flexWrap: "wrap" },
    btn: { padding: "10px 16px", background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    btnPrimary: { background: "var(--brand-text-primary)", color: "var(--brand-abyssal)", border: "none" },
    card: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" as const, gap: 12 },
    cardTitle: { fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 14, color: "var(--brand-text-primary)", borderBottom: "1px solid var(--brand-border)", paddingBottom: 12, marginBottom: 16 },
    threatBox: { display: "flex", alignItems: "center", gap: 16 },
    threatScore: { fontFamily: "var(--font-outfit)", fontWeight: 900, fontSize: 32, lineHeight: 1 },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const },
    hashBox: { background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: 12, borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--brand-text-secondary)", wordBreak: "break-all" as const, marginTop: 4 },
  };

  const handleExportPdf = () => {
    exportForensicPdf({
      title: t("report.reportTitle"),
      fileName: "suspicious_payload.exe",
      fileSize: "420 KB",
      threatScore: 85,
      severity: t("report.maliciousArtifact"),
      hashes: {
        md5: "3a42d9f86d081884c7d659a2feaa0c55",
        sha1: "fa328b9d0b8db2d128ea73e823b8db2d128ee5d0",
        sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      },
      signatures: ["Malware_Suspicious_Strings", "Packing_Detected"],
      notes: [t("report.note1"), t("report.note2")],
      custody: [t("report.custodyExport1"), t("report.custodyExport2"), t("report.custodyExport3")],
    });
  };

  return (
    <div style={s.container}>
      <button type="button" style={{ ...s.backLink, background: "none", border: "none" }} onClick={handleBackToScanner}>
        {t("report.backToScanner")}
      </button>

      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}>
            <FileText size={24} />
          </div>
          <div style={s.headerInfo}>
            <h1 style={s.headerTitle}>suspicious_payload.exe</h1>
            <p style={s.headerSub}>
              {t("report.size")}: 420 KB | {t("report.triageReport")}
            </p>
          </div>
        </div>
        <div style={s.headerButtons}>
          <button style={s.btn} onClick={handleExportPdf}>
            <Download size={14} />
            <span>{t("report.downloadPdf")}</span>
          </button>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={handleAddToEvidence}>
            <span>{t("report.addToEvidence")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
        <div style={s.card}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--brand-text-secondary)", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
            {t("report.threatLevel")}
          </span>
          <div style={s.threatBox}>
            <AlertTriangle size={40} style={{ color: "var(--brand-crimson)" }} />
            <div>
              <div style={{ ...s.threatScore, color: "var(--brand-crimson)" }}>85%</div>
              <span style={{ ...s.badge, background: "rgba(255,95,95,0.1)", color: "var(--brand-crimson)", border: "1px solid rgba(255,95,95,0.2)" }}>
                {t("report.maliciousArtifact")}
              </span>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("report.digitalHashes")}</h3>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {["MD5", "SHA-1", "SHA-256"].map((label, i) => (
              <div key={label} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{ fontSize: 8, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{label}</span>
                <div style={s.hashBox}>
                  {i === 0 && "3a42d9f86d081884c7d659a2feaa0c55"}
                  {i === 1 && "fa328b9d0b8db2d128ea73e823b8db2d128ee5d0"}
                  {i === 2 && "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>{t("report.yaraMatched")}</h3>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {["Malware_Suspicious_Strings", "Packing_Detected"].map((rule) => (
            <div key={rule} style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--brand-crimson)", marginBottom: 8 }}>{rule}</div>
              <p style={{ fontSize: 10, color: "var(--brand-text-secondary)", fontFamily: "var(--font-mono)" }}>{t("report.yaraSource")}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>{t("report.custodyTitle")}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <ShieldCheck size={16} style={{ color: "var(--brand-emerald)" }} />
          <span style={{ fontSize: 12, color: "var(--brand-text-primary)", fontWeight: 600 }}>{t("report.custodyVerified")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {[t("report.custody1"), t("report.custody2"), t("report.custody3")].map((item) => (
            <div key={item} style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, padding: 10, fontSize: 11, color: "var(--brand-text-secondary)" }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>{t("report.intelTitle")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>VirusTotal</span>
            <p style={{ fontSize: 16, fontWeight: 900, color: "var(--brand-crimson)", marginTop: 8 }}>54/72</p>
          </div>
          <div style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>AlienVault OTX</span>
            <p style={{ fontSize: 14, fontWeight: 900, color: "var(--brand-amber)", marginTop: 8 }}>{t("report.malicious")}</p>
          </div>
          <div style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: 12, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("report.localCache")}</span>
            <p style={{ fontSize: 14, fontWeight: 900, color: "var(--brand-emerald)", marginTop: 8 }}>{t("report.known")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
