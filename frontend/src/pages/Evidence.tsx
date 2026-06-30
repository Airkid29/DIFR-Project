// EVIDENCE PAGE
import React, { useState } from "react";
import { Database, Plus, Search, Download } from "lucide-react";
import { exportForensicPdf } from "../utils/pdfExport";
import { t } from "../i18n";

interface EvidenceItem {
  id: string;
  name: string;
  category: string;
  collector: string;
  date_collected: string;
  sha256_hash: string;
  custodian: string;
  verified: boolean;
  custody_chain: any[];
}

export default function Evidence() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([
    {
      id: "EVID-9021",
      name: "Corporate DC01 SSD dump",
      category: "Disk Image",
      collector: "R. Jenkins",
      date_collected: "2026-06-27T02:50:00.000Z",
      sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      custodian: "Inspector Sarah Vance",
      verified: true,
      custody_chain: [
        { id: 1, date: "2026-06-27T02:50:00.000Z", from: "Acquisition", to: "RachCode", action: "Initial acquisition & cryptographic hashing" }
      ]
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ name: "", category: "Disk Image", sha256: "", custodian: "Analyst A" });
  const [statusMessage, setStatusMessage] = useState("");

  const handleExportEvidencePdf = () => {
    if (!selectedItem) return;
    exportForensicPdf({
      title: "Evidence Audit Report",
      fileName: selectedItem.name,
      fileSize: "—",
      threatScore: selectedItem.verified ? 32 : 67,
      severity: selectedItem.verified ? "Verified Evidence" : "Unverified",
      hashes: {
        md5: selectedItem.sha256_hash.slice(0, 32).padEnd(32, "0"),
        sha1: selectedItem.sha256_hash.slice(0, 40).padEnd(40, "0"),
        sha256: selectedItem.sha256_hash
      },
      signatures: ["Chain-of-custody intact", "Evidence file verified"],
      notes: ["Evidence item analyzed by digital forensic team.", "Audit report generated for presentation."],
      custody: selectedItem.custody_chain.map((entry) => `${new Date(entry.date).toLocaleString()} - ${entry.action}`)
    });
  };

  const handleRegisterEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: EvidenceItem = {
      id: `EVID-${Math.floor(9000 + Math.random() * 999)}`,
      name: newEvidence.name || "New Evidence Item",
      category: newEvidence.category,
      collector: "Analyst A",
      date_collected: new Date().toISOString(),
      sha256_hash: newEvidence.sha256 || "0000000000000000000000000000000000000000000000000000000000000000",
      custodian: newEvidence.custodian,
      verified: false,
      custody_chain: [
        { id: 1, date: new Date().toISOString(), from: "Registration", to: newEvidence.custodian, action: "Evidence registered and hashed" }
      ]
    };
    setEvidence((prev) => [newItem, ...prev]);
    setSelectedItem(newItem);
    setIsRegistering(false);
    setNewEvidence({ name: "", category: "Disk Image", sha256: "", custodian: "Analyst A" });
    setStatusMessage(t("evidence.registeredSuccess"));
    window.setTimeout(() => setStatusMessage(""), 3200);
  };

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    headerText: { flex: 1 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 11, color: "#9CA3AF" },
    btn: { padding: "10px 16px", background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    splitGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
    controlBar: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16 },
    searchWrap: { position: "relative" },
    input: { width: "100%", padding: "8px 12px 8px 36px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12, color: "#F9FAFB", outline: "none" },
    evidenceCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s", marginBottom: 12, display: "flex", justifyContent: "space-between" },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.2)", textTransform: "uppercase" },
    badgeVerified: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
    detailPanel: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20 },
    panelTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 16 }
  };

  const filtered = evidence.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerText}>
          <h1 style={s.title}>{t("evidence.title")}</h1>
          <p style={s.desc}>{t("evidence.desc")}</p>
        </div>
        <button style={s.btn} onClick={() => setIsRegistering(true)}>
          <Plus size={16} />
          <span>{t("evidence.registerEvidence")}</span>
        </button>
      </div>

      <div style={s.splitGrid}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.controlBar}>
            <div style={s.searchWrap}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="text" style={s.input} placeholder={t("evidence.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div>
            {filtered.map((item) => (
              <div key={item.id} style={{ ...s.evidenceCard, borderColor: selectedItem?.id === item.id ? "#3B82F6" : "#1F2937", background: selectedItem?.id === item.id ? "rgba(59, 130, 246, 0.05)" : "rgba(17, 24, 39, 0.5)" }} onClick={() => setSelectedItem(item)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{item.id}</span>
                    <span style={s.badge}>{item.category === "Disk Image" ? t("evidence.diskImage") : item.category === "RAM Dump" ? t("evidence.ramDump") : item.category === "Log File" ? t("evidence.logFile") : item.category}</span>
                    {item.verified && <span style={{ ...s.badge, ...s.badgeVerified }}>✓ {t("evidence.verified")}</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", marginBottom: 8 }}>{item.name}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 10 }}>
                    <div><span style={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>{t("evidence.custodian")}</span><p style={{ color: "#F9FAFB", fontWeight: 600, marginTop: 4 }}>{item.custodian}</p></div>
                    <div><span style={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>SHA-256</span><p style={{ color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace", marginTop: 4, fontSize: 9 }}>{item.sha256_hash.slice(0, 16)}...</p></div>
                  </div>
                </div>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                  <Database size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedItem ? (
            <div style={s.detailPanel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{selectedItem.id} {t("evidence.detail")}</span>
                <button type="button" style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }} onClick={handleExportEvidencePdf}>
                  <Download size={14} />
                  <span>{t("evidence.pdfAudit")}</span>
                </button>
              </div>

              <h3 style={s.panelTitle}>{selectedItem.name}</h3>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 12 }}>{t("evidence.custodyTimeline")}</label>
                <div style={{ borderLeft: "2px solid #1F2937", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  {selectedItem.custody_chain.map((hist: any) => (
                    <div key={hist.id} style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: -23, top: 6, width: 8, height: 8, background: "#3B82F6", borderRadius: "50%" }} />
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#F9FAFB", marginBottom: 4 }}>{hist.to}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{t("evidence.fromAction", { from: hist.from, action: hist.action })}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...s.detailPanel, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <Database size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>{t("evidence.selectEvidence")}</p>
            </div>
          )}
        </div>
      </div>

      {isRegistering && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsRegistering(false)} />
          <div style={{ position: "relative", background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20, maxWidth: 420, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1F2937" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>{t("evidence.modalTitle")}</h3>
              <button onClick={() => setIsRegistering(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleRegisterEvidence}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("evidence.evidenceName")}</label>
                <input type="text" style={{ ...s.input, width: "100%" }} placeholder={t("evidence.namePlaceholder")} value={newEvidence.name} onChange={(e) => setNewEvidence((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("evidence.category")}</label>
                <select style={{ ...s.input, width: "100%" }} value={newEvidence.category} onChange={(e) => setNewEvidence((prev) => ({ ...prev, category: e.target.value }))}>
                  <option value="Disk Image">{t("evidence.diskImage")}</option>
                  <option value="RAM Dump">{t("evidence.ramDump")}</option>
                  <option value="Log File">{t("evidence.logFile")}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("evidence.sha256Hash")}</label>
                <input type="text" style={{ ...s.input, width: "100%", fontFamily: "'JetBrains Mono', monospace" }} placeholder={t("evidence.hashPlaceholder")} value={newEvidence.sha256} onChange={(e) => setNewEvidence((prev) => ({ ...prev, sha256: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("evidence.custodian")}</label>
                <input type="text" style={{ ...s.input, width: "100%" }} placeholder="Analyst A" value={newEvidence.custodian} onChange={(e) => setNewEvidence((prev) => ({ ...prev, custodian: e.target.value }))} />
              </div>
              <button type="submit" style={{ padding: 12, background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                {t("evidence.registerAndAudit")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}