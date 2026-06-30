// AUDIT LOG PAGE
import React, { useState } from "react";
import { Download } from "lucide-react";
import { t } from "../i18n";

interface AuditEntry {
  id: string;
  time: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "failure";
}

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [logs] = useState<AuditEntry[]>([
    { id: "AUD-1002", time: "2026-06-27 03:10:02.415", user: "rachcode@forensiguard.com", action: "MFA_LOGIN_SUCCESS", resource: "Session Token", ip: "192.168.1.15", status: "success" },
    { id: "AUD-1001", time: "2026-06-27 02:52:18.910", user: "s.vance@forensiguard.com", action: "EVIDENCE_REGISTER", resource: "EVID-9022 (RAM Dump)", ip: "192.168.1.28", status: "success" },
    { id: "AUD-1000", time: "2026-06-27 02:46:04.112", user: "s.vance@forensiguard.com", action: "YARA_SCAN_TRIGGER", resource: "cobalt_strike_beacon.dll", ip: "192.168.1.28", status: "success" },
    { id: "AUD-0999", time: "2026-06-27 01:32:00.825", user: "a.jenkins@forensiguard.com", action: "EVIDENCE_TRANSFER", resource: "EVID-9021", ip: "192.168.1.42", status: "success" },
    { id: "AUD-0998", time: "2026-06-27 01:14:10.510", user: "a.jenkins@forensiguard.com", action: "INCIDENT_CREATE", resource: "INC-2026-001", ip: "192.168.1.42", status: "success" },
    { id: "AUD-0997", time: "2026-06-26 19:42:01.320", user: "m.chang@forensiguard.com", action: "MFA_LOGIN_FAILURE", resource: "Session Token", ip: "10.0.4.15", status: "failure" }
  ]);

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    banner: { display: "flex", flexDirection: "column" as const, gap: 16 },
    bannerTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 24, color: "#F9FAFB", letterSpacing: -0.5 },
    bannerDesc: { fontSize: 12, color: "#9CA3AF" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    exportBtn: { padding: "8px 16px", border: "1px solid #1F2937", background: "transparent", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" },
    controlPane: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 16 },
    searchWrap: { position: "relative", flex: 1, maxWidth: 320 },
    searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" },
    searchInput: { width: "100%", padding: "8px 12px 8px 36px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12, color: "#F9FAFB", outline: "none" },
    tableWrap: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" },
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

  const handleExportCsv = () => {
    const csvRows = [
      ["Audit ID", "Time", "User", "Action", "Resource", "IP", "Status"],
      ...logs.map((log) => [log.id, log.time, log.user, log.action, log.resource, log.ip, log.status])
    ];
    const csvContent = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase())
  );

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

      <div style={s.controlPane}>
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
                <td style={s.td}>{log.time}</td>
                <td style={{ ...s.td, ...s.tdPrimary }}>{log.user}</td>
                <td style={{ ...s.td, color: "#F9FAFB", fontWeight: 600 }}>{log.action}</td>
                <td style={s.td}>{log.resource}</td>
                <td style={s.td}>{log.ip}</td>
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
  );
}