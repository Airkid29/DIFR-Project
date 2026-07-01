// PROFILE PAGE — API-backed with password change
import React, { useEffect, useState } from "react";
import { User, Smartphone, ShieldCheck, Clock3, KeyRound, Building2 } from "lucide-react";
import { api } from "../utils/api";
import { ps } from "../utils/pageStyles";
import { t } from "../i18n";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  account_type: string;
  organization_name?: string;
  mfa_enabled: boolean;
  last_login?: string;
}

interface ActivityItem {
  id: number;
  title: string;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    api.get("/api/auth/me").then((data) => {
      setUser(data);
      setName(data.name);
      setOrgName(data.organization_name || "");
    }).catch(console.error);
    api.get("/api/history?limit=5").then(setActivity).catch(console.error);
  }, []);

  const handleSaveAccount = async () => {
    try {
      const updated = await api.put("/api/auth/me", {
        name,
        organization_name: user?.account_type === "enterprise" ? orgName : undefined,
      });
      setUser(updated);
      setAccountMessage(t("profile.accountSaved"));
      window.setTimeout(() => setAccountMessage(""), 3200);
    } catch {
      setAccountMessage(t("common.serverError"));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError(t("auth.passwordsMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError(t("auth.passwordMinLength"));
      return;
    }
    try {
      await api.post("/api/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordMessage(t("profile.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.setTimeout(() => setPasswordMessage(""), 3200);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : t("common.serverError"));
    }
  };

  if (!user) {
    return <div style={ps.muted}>{t("common.loading")}</div>;
  }

  return (
    <div style={{ ...ps.container, maxWidth: 1100, margin: "0 auto" }}>
      <div>
        <h1 style={ps.title}>{t("profile.title")}</h1>
        <p style={ps.desc}>{t("profile.desc")}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <div style={ps.card}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--brand-text-secondary)" }}>{t("profile.role")}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-text-primary)", marginTop: 6 }}>{user.role}</div>
        </div>
        <div style={ps.card}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--brand-text-secondary)" }}>{t("profile.accountType")}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-cyan)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            {user.account_type === "enterprise" ? <Building2 size={18} /> : <User size={18} />}
            {user.account_type === "enterprise" ? t("auth.enterpriseAccount") : t("auth.professionalAccount")}
          </div>
        </div>
        <div style={ps.card}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--brand-text-secondary)" }}>{t("profile.lastLogin")}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-emerald)", marginTop: 6 }}>
            {user.last_login ? new Date(user.last_login).toLocaleString() : t("common.never")}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div style={ps.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--brand-border)", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: "rgba(99,142,203,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-cyan)" }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "var(--brand-text-primary)" }}>{user.name}</div>
              <div style={ps.muted}>{user.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span style={ps.label}>{t("profile.editFullName")}</span>
              <input type="text" style={ps.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {user.account_type === "enterprise" && (
              <div>
                <span style={ps.label}>{t("auth.organizationName")}</span>
                <input type="text" style={ps.input} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
            )}
            <button type="button" style={ps.btnSecondary} onClick={handleSaveAccount}>{t("profile.saveAccount")}</button>
            {accountMessage && <div style={{ ...ps.success, fontSize: 12 }}>{accountMessage}</div>}
          </div>
        </div>

        <div style={ps.card}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--brand-text-primary)", borderBottom: "1px solid var(--brand-border)", paddingBottom: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <KeyRound size={16} />
            {t("profile.changePassword")}
          </h3>
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><span style={ps.label}>{t("profile.currentPassword")}</span><input type="password" style={ps.input} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
            <div><span style={ps.label}>{t("profile.newPassword")}</span><input type="password" style={ps.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} /></div>
            <div><span style={ps.label}>{t("common.confirmPassword")}</span><input type="password" style={ps.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
            {passwordError && <div style={{ ...ps.danger, fontSize: 12 }}>{passwordError}</div>}
            {passwordMessage && <div style={{ ...ps.success, fontSize: 12 }}>{passwordMessage}</div>}
            <button type="submit" style={ps.btnPrimary}>{t("profile.updatePassword")}</button>
          </form>

          <div style={{ marginTop: 20, borderTop: "1px solid var(--brand-border)", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13, color: "var(--brand-text-primary)", marginBottom: 12 }}>
              <ShieldCheck size={16} style={{ color: "var(--brand-emerald)" }} />
              {t("profile.latestActivities")}
            </div>
            {activity.length === 0 ? (
              <p style={ps.muted}>{t("history.empty")}</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} style={{ ...ps.card, padding: 10, marginBottom: 8, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--brand-text-primary)" }}>{item.title}</span>
                  <span style={{ ...ps.muted, fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><Clock3 size={10} />{new Date(item.created_at).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
