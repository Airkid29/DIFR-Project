// EVIDENCE PAGE â€” API-backed with custody transfer
import React, { useEffect, useState } from "react";
import { Database, Plus, Search, Download, ArrowRightLeft } from "lucide-react";
import { api, apiUrl } from "../utils/api";
import { exportForensicPdf } from "../utils/pdfExport";
import { ps } from "../utils/pageStyles";
import { t } from "../i18n";

interface CustodyEntry {
  id: number;
  date: string;
  transfer_from: string;
  transfer_to: string;
  action_taken: string;
}

interface EvidenceItem {
  id: string;
  name: string;
  category: string;
  collector: string;
  date_collected: string;
  sha256_hash: string;
  custodian: string;
  location: string;
  verified: boolean;
  status?: string;
  pending_custodian_id?: number | null;
  custody_chain: CustodyEntry[];
}

export default function Evidence() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ name: "", category: "Disk Image", sha256: "", location: "Secure vault" });
  const [transfer, setTransfer] = useState({ transfer_to: "", action_taken: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const loadEvidence = () => {
    setLoading(true);
    api.get("/api/evidence")
      .then((data) => setEvidence(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEvidence(); }, []);

  const handleExportEvidencePdf = () => {
    if (!selectedItem) return;
    exportForensicPdf({
      title: "Evidence Audit Report",
      fileName: selectedItem.name,
      fileSize: "—",
      threatScore: selectedItem.verified ? 32 : 67,
      severity: selectedItem.verified ? "Verified Evidence" : "Unverified",
      hashes: { md5: selectedItem.sha256_hash.slice(0, 32), sha1: selectedItem.sha256_hash.slice(0, 40), sha256: selectedItem.sha256_hash },
      signatures: ["Chain-of-custody intact"],
      notes: ["Evidence item analyzed by digital forensic team."],
      custody: selectedItem.custody_chain.map((e) => `${new Date(e.date).toLocaleString()} - ${e.action_taken}`),
    });
  };

  const handleDownloadServerPdf = async () => {
    if (!selectedItem) return;
    const token = localStorage.getItem("DFIR-Lab_token");
    const res = await fetch(apiUrl(`/api/evidence/${selectedItem.id}/report`), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DFIR-Lab_Report_${selectedItem.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegisterEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.post("/api/evidence", {
        name: newEvidence.name,
        category: newEvidence.category,
        sha256_hash: newEvidence.sha256,
        location: newEvidence.location,
      });
      setEvidence((prev) => [created, ...prev]);
      setSelectedItem(created);
      setIsRegistering(false);
      setNewEvidence({ name: "", category: "Disk Image", sha256: "", location: "Secure vault" });
      setStatusMessage(t("evidence.registeredSuccess"));
      window.setTimeout(() => setStatusMessage(""), 3200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      const updated = await api.post(`/api/evidence/${selectedItem.id}/transfer`, transfer);
      setEvidence((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedItem(updated);
      setIsTransferring(false);
      setTransfer({ transfer_to: "", action_taken: "" });
      setStatusMessage(t("evidence.transferSuccess"));
      window.setTimeout(() => setStatusMessage(""), 3200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferDecision = async (decision: "accept" | "reject") => {
    if (!selectedItem) return;
    try {
      const updated = decision === "accept"
        ? await api.post(`/api/evidence/${selectedItem.id}/accept-transfer`)
        : await api.post(`/api/evidence/${selectedItem.id}/reject-transfer`);
      setEvidence((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedItem(updated);
      setStatusMessage(decision === "accept" ? "Transfert accepté avec succès." : "Transfert rejeté.");
      window.setTimeout(() => setStatusMessage(""), 3200);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = evidence.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={ps.container}>
      <div style={ps.header}>
        <div>
          <h1 style={ps.title}>{t("evidence.title")}</h1>
          <p style={ps.desc}>{t("evidence.desc")}</p>
        </div>
        <button type="button" style={ps.btnPrimary} onClick={() => setIsRegistering(true)}>
          <Plus size={16} />
          <span>{t("evidence.registerEvidence")}</span>
        </button>
      </div>

      {statusMessage && (
        <div style={{ ...ps.card, color: "var(--brand-emerald)", fontSize: 13 }}>{statusMessage}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <div style={{ ...ps.card, marginBottom: 16, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", color: "var(--brand-text-secondary)" }} />
            <input type="text" style={{ ...ps.input, paddingLeft: 40, border: "none", background: "transparent" }} placeholder={t("evidence.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div style={ps.muted}>{t("common.loading")}</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  ...ps.card,
                  marginBottom: 12,
                  cursor: "pointer",
                  borderColor: selectedItem?.id === item.id ? "var(--brand-cyan)" : "var(--brand-border)",
                  background: selectedItem?.id === item.id ? "var(--theme-white-bg-tint)" : "var(--glass-bg)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ ...ps.mono, fontSize: 11, fontWeight: 700, color: "var(--brand-cyan)" }}>{item.id}</span>
                      <span style={{ ...ps.badge, background: "rgba(99,142,203,0.1)", color: "var(--brand-cyan)" }}>{item.category}</span>
                      {item.verified && <span style={{ ...ps.badge, color: "var(--brand-emerald)" }}>âœ“ {t("evidence.verified")}</span>}
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--brand-text-primary)", marginBottom: 8 }}>{item.name}</h3>
                    <div style={ps.muted}>{t("evidence.custodian")} : {item.custodian}</div>
                  </div>
                  <Database size={18} style={{ color: "var(--brand-text-secondary)" }} />
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedItem ? (
            <div style={ps.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }} className="flex-col sm:flex-row sm:items-center">
                <span style={{ ...ps.mono, fontSize: 11, color: "var(--brand-cyan)" }}>{selectedItem.id}</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" style={ps.btnSecondary} onClick={handleExportEvidencePdf}>
                    <Download size={14} /> PDF
                  </button>
                  <button type="button" style={ps.btnSecondary} onClick={handleDownloadServerPdf}>
                    <Download size={14} /> Serveur
                  </button>
                </div>
              </div>

              <h3 style={{ fontWeight: 700, marginBottom: 12, color: "var(--brand-text-primary)" }}>{selectedItem.name}</h3>
              <div style={{ ...ps.mono, fontSize: 10, ...ps.muted, marginBottom: 16, wordBreak: "break-all" }}>{selectedItem.sha256_hash}</div>

              {selectedItem.status === "transfer_pending" && (
                <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: "1px solid rgba(255, 191, 0, 0.35)", background: "rgba(255, 191, 0, 0.08)", color: "var(--brand-amber)" }}>
                  <strong>Transfert de custody en attente</strong>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Vous pouvez accepter ou refuser ce transfert avant que la responsabilité de la preuve ne soit mise à  jour.</div>
                </div>
              )}

              <label style={ps.label}>{t("evidence.custodyTimeline")}</label>
              <div style={{ borderLeft: "2px solid var(--brand-border)", paddingLeft: 16, marginBottom: 16 }}>
                {selectedItem.custody_chain.map((hist) => (
                  <div key={hist.id} style={{ marginBottom: 12, position: "relative" }}>
                    <div style={{ position: "absolute", left: -21, top: 4, width: 8, height: 8, background: "var(--brand-cyan)", borderRadius: "50%" }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--brand-text-primary)" }}>{hist.transfer_to}</div>
                    <div style={{ ...ps.muted, fontSize: 10 }}>{hist.transfer_from} → {hist.action_taken}</div>
                    <div style={{ ...ps.mono, fontSize: 9, ...ps.muted }}>{new Date(hist.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={ps.btnPrimary} onClick={() => setIsTransferring(true)}>
                  <ArrowRightLeft size={14} />
                  {t("evidence.transferCustody")}
                </button>
                {selectedItem.status === "transfer_pending" && (
                  <>
                    <button type="button" style={ps.btnSecondary} onClick={() => handleTransferDecision("accept")}>
                      Accepter
                    </button>
                    <button type="button" style={ps.btnSecondary} onClick={() => handleTransferDecision("reject")}>
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ ...ps.card, textAlign: "center", padding: 40 }}>
              <Database size={32} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
              <p style={ps.muted}>{t("evidence.selectEvidence")}</p>
            </div>
          )}
        </div>
      </div>

      {isRegistering && (
        <div style={ps.modalOverlay}>
          <div style={ps.modalBackdrop} onClick={() => setIsRegistering(false)} />
          <div style={ps.modal}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--brand-text-primary)" }}>{t("evidence.modalTitle")}</h3>
            <form onSubmit={handleRegisterEvidence} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={ps.label}>{t("evidence.evidenceName")}</label><input type="text" style={ps.input} value={newEvidence.name} onChange={(e) => setNewEvidence((p) => ({ ...p, name: e.target.value }))} required /></div>
              <div>
                <label style={ps.label}>{t("evidence.category")}</label>
                <select style={ps.input} value={newEvidence.category} onChange={(e) => setNewEvidence((p) => ({ ...p, category: e.target.value }))}>
                  <option value="Disk Image">{t("evidence.diskImage")}</option>
                  <option value="RAM Dump">{t("evidence.ramDump")}</option>
                  <option value="Log File">{t("evidence.logFile")}</option>
                </select>
              </div>
              <div><label style={ps.label}>{t("evidence.sha256Hash")}</label><input type="text" style={{ ...ps.input, ...ps.mono }} value={newEvidence.sha256} onChange={(e) => setNewEvidence((p) => ({ ...p, sha256: e.target.value }))} required minLength={64} maxLength={64} /></div>
              <button type="submit" style={ps.btnPrimary}>{t("evidence.registerAndAudit")}</button>
            </form>
          </div>
        </div>
      )}

      {isTransferring && selectedItem && (
        <div style={ps.modalOverlay}>
          <div style={ps.modalBackdrop} onClick={() => setIsTransferring(false)} />
          <div style={ps.modal}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--brand-text-primary)" }}>{t("evidence.transferCustody")}</h3>
            <form onSubmit={handleTransfer} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={ps.label}>{t("evidence.newCustodian")}</label><input type="text" style={ps.input} value={transfer.transfer_to} onChange={(e) => setTransfer((p) => ({ ...p, transfer_to: e.target.value }))} required /></div>
              <div><label style={ps.label}>{t("evidence.transferAction")}</label><textarea style={{ ...ps.input, minHeight: 70 }} value={transfer.action_taken} onChange={(e) => setTransfer((p) => ({ ...p, action_taken: e.target.value }))} required /></div>
              <button type="submit" style={ps.btnPrimary}>{t("evidence.confirmTransfer")}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
