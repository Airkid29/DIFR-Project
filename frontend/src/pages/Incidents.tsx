// INCIDENTS PAGE
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "triage" | "resolved";
  created_at: string;
  description: string;
}

export default function Incidents() {
  const [incidents] = useState<Incident[]>([
    { id: "INC-2026-001", title: "Ransomware outbreak on DC01", severity: "critical", status: "open", created_at: "2026-06-27T02:45:00Z", description: "Suspicious file execution detected on a domain controller" },
    { id: "INC-2026-002", title: "SSH brute force on WebServer-01", severity: "high", status: "triage", created_at: "2026-06-27T00:55:00Z", description: "Multiple failed login attempts against the admin account" },
    { id: "INC-2026-003", title: "Phishing lure delivered to finance mailbox", severity: "high", status: "open", created_at: "2026-06-26T15:10:00Z", description: "Credential harvesting email with an invoice PDF" },
    { id: "INC-2026-004", title: "Suspicious PowerShell execution on analyst host", severity: "medium", status: "resolved", created_at: "2026-06-25T11:20:00Z", description: "Encoded script downloaded from an internal share" },
    { id: "INC-2026-005", title: "Unusual smb traffic from backup appliance", severity: "medium", status: "triage", created_at: "2026-06-24T19:05:00Z", description: "Large data transfer outside business hours" },
    { id: "INC-2026-006", title: "USB device inserted on executive laptop", severity: "low", status: "resolved", created_at: "2026-06-24T08:35:00Z", description: "Approved removable media activity after review" }
  ]);

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSeverity, setNewSeverity] = useState<Incident["severity"]>("medium");

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 },
    headerText: { flex: 1 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 },
    btn: { padding: "12px 20px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    controlBar: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" },
    searchWrap: { position: "relative", flex: 1, minWidth: 240, maxWidth: 360 },
    input: { width: "100%", padding: "10px 12px 10px 40px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 13, color: "#F9FAFB", outline: "none" },
    table: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 },
    statCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16 }
  };

  const getSeverityColor = (sev: Incident["severity"]) => {
    const colors = {
      critical: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "rgba(239, 68, 68, 0.2)" },
      high: { bg: "rgba(251, 146, 60, 0.1)", color: "#FB923C", border: "rgba(251, 146, 60, 0.2)" },
      medium: { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "rgba(59, 130, 246, 0.2)" },
      low: { bg: "rgba(255, 255, 255, 0.05)", color: "#9CA3AF", border: "rgba(255, 255, 255, 0.1)" }
    };
    return colors[sev];
  };

  const filtered = incidents.filter((inc) =>
    inc.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterSeverity === "all" || inc.severity === filterSeverity)
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerText}>
          <h1 style={s.title}>Security Incident Logs</h1>
          <p style={s.desc}>A richer incident workspace for analyst review, case progression, and executive-ready reporting.</p>
        </div>
        <button style={s.btn} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Log Incident</span>
        </button>
      </div>

      <div style={s.statGrid}>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Open cases</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#F9FAFB", marginTop: 6 }}>3</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Critical</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#EF4444", marginTop: 6 }}>1</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Resolved</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#10B981", marginTop: 6 }}>2</div>
        </div>
      </div>

      <div style={s.controlBar}>
        <div style={s.searchWrap}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input type="text" style={s.input} placeholder="Search incident ID, title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={{ padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 13, color: "#F9FAFB" }} value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div style={s.table}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1F2937", background: "rgba(255,255,255,0.01)" }}>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Case ID</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Title</th>
              <th style={{ padding: 16, textAlign: "center", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Severity</th>
              <th style={{ padding: 16, textAlign: "center", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inc) => {
              const sevColor = getSeverityColor(inc.severity);
              return (
                <tr key={inc.id} style={{ borderBottom: "1px solid rgba(31,41,55,0.4)", transition: "background 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: 16, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#3B82F6" }}>{inc.id}</td>
                  <td style={{ padding: 16, color: "#F9FAFB", fontWeight: 600 }}>
                    <div>{inc.title}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{inc.description}</div>
                  </td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    <span style={{ ...s.badge, background: sevColor.bg, color: sevColor.color, border: `1px solid ${sevColor.border}` }}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: "center", fontSize: 11, color: "#10B981", fontWeight: 700, textTransform: "uppercase" }}>{inc.status}</td>
                  <td style={{ padding: 16, fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>
                    {new Date(inc.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsModalOpen(false)} />
          <div style={{ position: "relative", background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20, maxWidth: 440, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1F2937" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>Log Security Incident</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 22 }}>×</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Title</label>
                <input type="text" style={s.input} placeholder="e.g. SSH brute force attempt" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Severity</label>
                <select style={s.input} value={newSeverity} onChange={(e) => setNewSeverity(e.target.value as Incident["severity"])}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button style={{ padding: 12, background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                Create Incident
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}