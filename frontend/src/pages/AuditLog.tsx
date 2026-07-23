// AUDIT LOG PAGE
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { api } from "../utils/api";
import { t } from "../i18n";

interface AuditEntry {
  id: number;
  timestamp: string;
  user_email: string;
  action: string;
  resource?: string;
  ip_address?: string;
  status: "success" | "failure";
}

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const { data: logs = [] } = useQuery<AuditEntry[]>({
    queryKey: ["auditLogs"],
    queryFn: () => api.get("/api/audit"),
  });

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    banner: { display: "flex", flexDirection: "column" as const, gap: 16 },
    bannerTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "var(--page-title-size, 24px)" as any, color: "var(--brand-text-primary)", letterSpacing: -0.5 },
    bannerDesc: { fontSize: "var(--page-desc-size, 12px)" as any, color: "var(--brand-text-secondary)" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    exportBtn: { padding: "8px 16px", border: "1px solid #1F2937", background: "transparent", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" },
    controlPane: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" as const, alignItems: "stretch", gap: 16 },
    searchWrap: { position: "relative", flex: 1, width: "100%", maxWidth: 320 },
    searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" },
    searchInput: { width: "100%", padding: "8px 12px 8px 36px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, fontSize: 12, color: "var(--brand-text-primary)", outline: "none" },
    tableWrap: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
    thead: { background: "rgba(255, 255, 255, 0.01)", borderBottom: "1px solid #1F2937" },
    th: { padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 },
    tr: { borderBottom: "1px solid rgba(31, 41, 55, 0.4)", transition: "background 0.2s" },
    td: { padding: 16, fontSize: 12, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" },
    tdCyan: { color: "#3B82F6", fontWeight: 600 },
    tdPrimary: { color: "#F9FAFB", fontWeight: 500, fontFamily: "system-ui" },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" },
    badgeSuccess: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
    badgeFailure: { background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }
  };

  const filtered = logs.filter(l =>
    l.user_email.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.resource || "").toLowerCase().includes(search.toLowerCase())
  );

  // Formatte un timestamp ISO en date/heure lisible en français
  const formatTimestamp = (raw: string) => {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleExportCsv = () => {
    const now = new Date();
    // Le point-virgule est le séparateur par défaut d'Excel en locale FR
    const SEP = ";";
    const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

    // Bloc d'en-tête récapitulatif : contexte de l'export
    const metaLines: string[][] = [
      [t("audit.title") || "Journal d'audit"],
      [`Exporté le : ${now.toLocaleString("fr-FR")}`],
      [`Nombre d'entrées : ${filtered.length}${search ? ` (filtré sur "${search}")` : ""}`],
      [],
    ];

    const headerRow = [
      t("audit.auditId") || "ID",
      t("audit.preciseTime") || "Date / Heure",
      t("audit.analyst") || "Utilisateur",
      t("audit.actionCode") || "Action",
      t("audit.resource") || "Ressource",
      t("audit.ipAddress") || "Adresse IP",
      t("audit.status") || "Statut",
    ];

    const dataRows = filtered.map((log) => [
      log.id,
      formatTimestamp(log.timestamp),
      log.user_email,
      log.action,
      log.resource || "â€”",
      log.ip_address || "â€”",
      log.status === "success" ? (t("common.success") || "Succès") : (t("common.fail") || "à‰chec"),
    ]);

    const allRows = [...metaLines, headerRow, ...dataRows];
    const csvContent = allRows
      .map((row) => row.map(escapeCsv).join(SEP))
      .join("\r\n");

    // Ajout du BOM UTF-8 pour un affichage correct des accents dans Excel
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = now.toISOString().slice(0, 10);
    a.download = `journal_audit_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={s.container}>
      <div style={s.banner}>
        <div>
          <h1 style={s.bannerTitle}>{t("audit.title")}</h1>
          <p style={s.bannerDesc}>{t("audit.desc")}</p>
        </div>
        <div style={s.topBar}>
          <button style={s.exportBtn} onClick={handleExportCsv} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <Download size={16} />
            <span>{t("audit.exportCsv")}</span>
          </button>
        </div>
      </div>

      <div style={s.controlPane} className="sm:flex-row sm:items-center">
        <div style={s.searchWrap}>
          <svg style={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            style={s.searchInput}
            placeholder={t("audit.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={s.tableWrap}>
        <div className="table-responsive-container">
          <table style={s.table}>
          <thead style={s.thead}>
            <tr>
              <th style={s.th}>{t("audit.auditId")}</th>
              <th style={s.th}>{t("audit.preciseTime")}</th>
              <th style={s.th}>{t("audit.analyst")}</th>
              <th style={s.th}>{t("audit.actionCode")}</th>
              <th style={s.th}>{t("audit.resource")}</th>
              <th style={s.th}>{t("audit.ipAddress")}</th>
              <th style={{ ...s.th, textAlign: "center" }}>{t("audit.status")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} style={s.tr}>
                <td style={{ ...s.td, ...s.tdCyan }}>{log.id}</td>
                <td style={s.td}>{log.timestamp}</td>
                <td style={{ ...s.td, ...s.tdPrimary }}>{log.user_email}</td>
                <td style={{ ...s.td, color: "#F9FAFB", fontWeight: 600 }}>{log.action}</td>
                <td style={s.td}>{log.resource}</td>
                <td style={s.td}>{log.ip_address}</td>
                <td style={{ ...s.td, textAlign: "center" }}>
                  <span style={{ ...s.badge, ...(log.status === "success" ? s.badgeSuccess : s.badgeFailure) }}>
                    {log.status === "success" ? t("common.success") : t("common.fail")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}