// USERS PAGE
import React, { useState } from "react";
import { Plus, Search, ShieldCheck, ShieldAlert, UserMinus, X } from "lucide-react";

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  mfa_enabled: boolean;
  lastLogin: string;
}

export default function Users() {
  const [search, setSearch] = useState("");
  const [members] = useState<TeamMember[]>([
    { id: 1, name: "RachCode", email: "rachcode@forensiguard.com", role: "Admin", mfa_enabled: true, lastLogin: "2026-06-27 03:10" },
    { id: 2, name: "Sarah Vance", email: "s.vance@forensiguard.com", role: "Responder L3", mfa_enabled: true, lastLogin: "2026-06-27 02:44" },
    { id: 3, name: "Alex Jenkins", email: "a.jenkins@forensiguard.com", role: "Analyst L2", mfa_enabled: false, lastLogin: "2026-06-27 01:05" }
  ]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 11, color: "#9CA3AF" },
    btn: { padding: "10px 16px", background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    controlBar: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16 },
    table: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }
  };

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>User Management</h1>
          <p style={s.desc}>Configure RBAC roles, security credentials, and audit status of SOC team access.</p>
        </div>
        <button style={s.btn} onClick={() => setIsInviteOpen(true)}>
          <Plus size={16} />
          <span>Invite Member</span>
        </button>
      </div>

      <div style={s.controlBar}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            type="text"
            style={{ width: 320, padding: "8px 12px 8px 36px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12, color: "#F9FAFB", outline: "none" }}
            placeholder="Search team member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={s.table}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1F2937", background: "rgba(255,255,255,0.01)" }}>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>User Details</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>RBAC Role</th>
              <th style={{ padding: 16, textAlign: "center", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>MFA</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Last Login</th>
              <th style={{ padding: 16, textAlign: "right", fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid rgba(31,41,55,0.4)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB", marginBottom: 4 }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{member.email}</div>
                </td>
                <td style={{ padding: 16 }}>
                  <select style={{ padding: "6px 10px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 6, fontSize: 11, color: "#F9FAFB" }}>
                    <option>Admin</option>
                    <option selected>{member.role}</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </td>
                <td style={{ padding: 16, textAlign: "center" }}>
                  {member.mfa_enabled ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "2px 6px", borderRadius: 4 }}>
                      <ShieldCheck size={12} /> Active
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "2px 6px", borderRadius: 4 }}>
                      <ShieldAlert size={12} /> Disabled
                    </span>
                  )}
                </td>
                <td style={{ padding: 16, fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{member.lastLogin}</td>
                <td style={{ padding: 16, textAlign: "right" }}>
                  <button style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 6 }}>
                    <UserMinus size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsInviteOpen(false)} />
          <div style={{ position: "relative", background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20, maxWidth: 420, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1F2937" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>Invite Team Member</h3>
              <button onClick={() => setIsInviteOpen(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); setIsInviteOpen(false); }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Full Name</label>
                <input type="text" style={{ width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" }} placeholder="e.g. Sarah Jenkins" />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email Address</label>
                <input type="email" style={{ width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" }} placeholder="sarah.j@forensiguard.com" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Role</label>
                  <select style={{ width: "100%", padding: "8px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 11 }}>
                    <option>Admin</option>
                    <option>Responder</option>
                    <option>Analyst</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Temp Password</label>
                  <input type="text" style={{ width: "100%", padding: "8px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 11 }} defaultValue="SecureTempPass123!" />
                </div>
              </div>
              <button style={{ padding: 12, background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                Invite Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}