// USERS PAGE
import React, { useState } from "react";
import { Plus, Search, ShieldCheck, ShieldAlert, UserMinus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import { t } from "../i18n";

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  account_type?: string;
  organization_name?: string;
  mfa_enabled: boolean;
  last_login?: string | null;
}

const ROLE_OPTIONS = [
  { value: "Admin", label: t("users.roleAdmin") },
  { value: "Responder", label: t("users.roleResponder") },
  { value: "Analyst", label: t("users.roleAnalyst") },
  { value: "Viewer", label: t("users.roleViewer") },
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/api/users"),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: { userId: number; role: string }) => api.put(`/api/users/${data.userId}/role`, { role: data.role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => api.delete(`/api/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const createInviteMutation = useMutation({
    mutationFn: (user: { name: string; email: string; role: string; password: string }) => api.post("/api/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsInviteOpen(false);
    },
  });

  const filtered = (members as TeamMember[]).filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "var(--page-title-size, 28px)" as any, color: "var(--brand-text-primary)", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: "var(--page-desc-size, 11px)" as any, color: "var(--brand-text-secondary)" },
    btn: { padding: "10px 16px", background: "var(--brand-cyan)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    controlBar: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 16 },
    table: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, overflow: "hidden" },
    badgeSuccess: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald)", padding: "2px 6px", borderRadius: 4 },
    badgeError: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, background: "rgba(239, 68, 68, 0.1)", color: "var(--brand-crimson)", padding: "2px 6px", borderRadius: 4 },
    btnDanger: { background: "none", border: "none", color: "var(--brand-crimson)", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", gap: 4 },
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleDelete = (userId: number) => {
    if (confirm(t("users.confirmRemove"))) {
      deleteUserMutation.mutate(userId);
    }
  };

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [invitePassword, setInvitePassword] = useState("SecureTempPass123!");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteName && inviteEmail && inviteRole) {
      createInviteMutation.mutate({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        password: invitePassword,
      });
      setInviteName("");
      setInviteEmail("");
      setInviteRole("Viewer");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>{t("users.title")}</h1>
          <p style={s.desc}>{t("users.desc")}</p>
        </div>
        <button style={s.btn} onClick={() => setIsInviteOpen(true)}>
          <Plus size={16} />
          <span>{t("users.inviteMember")}</span>
        </button>
      </div>

      <div style={s.controlBar}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brand-text-secondary)" }} />
          <input
            type="text"
            style={{ width: "100%", maxWidth: 320, padding: "8px 12px 8px 36px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, fontSize: 12, color: "var(--brand-text-primary)", outline: "none" }}
            placeholder={t("users.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={s.table}>
        <div className="table-responsive-container">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--brand-border)", background: "var(--theme-subtle-bg)" }}>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("users.userDetails")}</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("users.rbacRole")}</th>
              <th style={{ padding: 16, textAlign: "center", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("users.mfa")}</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("users.lastLogin")}</th>
              <th style={{ padding: 16, textAlign: "right", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid var(--brand-border)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--theme-white-bg-tint)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--brand-text-primary)", marginBottom: 4 }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: "var(--brand-text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{member.email}</div>
                  {member.account_type && (
                    <div style={{ fontSize: 9, marginTop: 4, color: member.account_type === "enterprise" ? "var(--brand-emerald)" : "var(--brand-cyan)", fontWeight: 700, textTransform: "uppercase" }}>
                      {member.account_type === "enterprise" ? t("auth.enterpriseAccount") : t("auth.professionalAccount")}
                      {member.organization_name ? ` · ${member.organization_name}` : ""}
                    </div>
                  )}
                </td>
                <td style={{ padding: 16 }}>
                  <select
                    style={{ padding: "6px 10px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 6, fontSize: 11, color: "var(--brand-text-primary)", cursor: "pointer" }}
                    value={member.role}
                    onChange={e => handleRoleChange(Number(member.id), e.target.value)}
                  >
                    {ROLE_OPTIONS.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 16, textAlign: "center" }}>
                  {member.mfa_enabled ? (
                    <span style={s.badgeSuccess}>
                      <ShieldCheck size={12} /> {t("users.active")}
                    </span>
                  ) : (
                    <span style={s.badgeError}>
                      <ShieldAlert size={12} /> {t("common.disabled")}
                    </span>
                  )}
                </td>
                <td style={{ padding: 16, fontSize: 11, color: "var(--brand-text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {member.last_login ? new Date(member.last_login).toLocaleString() : t("common.never")}
                </td>
                <td style={{ padding: 16, textAlign: "right" }}>
                  <button onClick={() => handleDelete(Number(member.id))} style={s.btnDanger} title={t("users.removeUser")}>
                    <UserMinus size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {isInviteOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsInviteOpen(false)} />
          <div style={{ position: "relative", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 20, maxWidth: 420, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--brand-border)" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--brand-text-primary)" }}>{t("users.modalTitle")}</h3>
              <button onClick={() => setIsInviteOpen(false)} style={{ background: "none", border: "none", color: "var(--brand-text-secondary)", cursor: "pointer", fontSize: 20 }}>à—</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleInviteSubmit}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("common.fullName")}</label>
                <input
                  type="text"
                  style={{ width: "100%", padding: "10px 12px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 12, outline: "none" }}
                  placeholder={t("users.namePlaceholder")}
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("users.emailAddress")}</label>
                <input
                  type="email"
                  style={{ width: "100%", padding: "10px 12px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 12, outline: "none" }}
                  placeholder="sarah.j@DFIR-Lab.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("users.role")}</label>
                  <select
                    style={{ width: "100%", padding: "8px 12px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 11 }}
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                  >
                    {ROLE_OPTIONS.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("users.tempPassword")}</label>
                  <input
                    type="text"
                    style={{ width: "100%", padding: "8px 12px", background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 11 }}
                    value={invitePassword}
                    onChange={e => setInvitePassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" style={{ padding: 12, background: "var(--brand-cyan)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                {t("users.inviteMember")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}