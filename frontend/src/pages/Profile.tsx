// PROFILE PAGE — API-backed with password change
import React, { useEffect, useState } from "react";
import { User, ShieldCheck, Clock3, KeyRound, Building2 } from "lucide-react";
import SlackIcon from "../assets/slack-removebg-preview.png";
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
  onboarding_completed?: boolean;
  last_login?: string;
  slack_webhook_url?: string | null;
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
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [slackMessage, setSlackMessage] = useState("");
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [mfaMessage, setMfaMessage] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [setupUri, setSetupUri] = useState<string | null>(null);
  const [isConfiguringMfa, setIsConfiguringMfa] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me").then((data) => {
      setUser(data);
      setName(data.name);
      setOrgName(data.organization_name || "");
      setSlackWebhookUrl(data.slack_webhook_url || "");
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

  const handleSaveSlack = async () => {
    try {
      const updated = await api.put("/api/auth/me", {
        slack_webhook_url: slackWebhookUrl.trim() || null,
      });
      setUser(updated);
      setSlackMessage("Slack webhook configuré avec succès!");
      window.setTimeout(() => setSlackMessage(""), 3200);
    } catch {
      setSlackMessage("Erreur lors de la configuration de Slack.");
      window.setTimeout(() => setSlackMessage(""), 3200);
    }
  };

  const handleTestSlack = async () => {
    try {
      await api.post("/api/integrations/slack/test", { message: "Test de notification Slack depuis Velora!" });
      setSlackMessage("Test de notification envoyé!");
      window.setTimeout(() => setSlackMessage(""), 3200);
    } catch {
      setSlackMessage("Erreur lors de l'envoi du test.");
      window.setTimeout(() => setSlackMessage(""), 3200);
    }
  };

  const handleStartMfaSetup = async () => {
    setMfaError("");
    setMfaMessage("");
    setIsConfiguringMfa(true);

    try {
      const data = await api.post("/api/auth/mfa/setup");
      setSetupSecret(data.secret);
      setSetupUri(data.otpauth_uri);
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : t("common.serverError"));
    } finally {
      setIsConfiguringMfa(false);
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError("");
    setMfaMessage("");

    if (!mfaCode || mfaCode.length !== 6) {
      setMfaError(t("auth.mfaInvalid"));
      return;
    }

    try {
      await api.post("/api/auth/mfa/enable", { code: mfaCode });
      setMfaMessage(t("profile.mfaEnabledSuccess"));
      setSetupSecret(null);
      setSetupUri(null);
      setMfaCode("");
      setUser((prev) => (prev ? { ...prev, mfa_enabled: true } : prev));
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : t("common.serverError"));
    }
  };

  const handleDisableMfa = async () => {
    setMfaError("");
    setMfaMessage("");

    if (!mfaCode || mfaCode.length !== 6) {
      setMfaError(t("auth.mfaInvalid"));
      return;
    }

    try {
      await api.post("/api/auth/mfa/disable", { code: mfaCode });
      setMfaMessage(t("profile.mfaDisabledSuccess"));
      setMfaCode("");
      setUser((prev) => (prev ? { ...prev, mfa_enabled: false } : prev));
    } catch (err: unknown) {
      setMfaError(err instanceof Error ? err.message : t("common.serverError"));
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
              <img src={SlackIcon} alt="Slack" style={{ width: "16px", height: "16px" }} />
              Notifications Slack
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span style={ps.label}>URL du Webhook Slack</span>
                <input 
                  type="text" 
                  style={ps.input} 
                  value={slackWebhookUrl} 
                  onChange={(e) => setSlackWebhookUrl(e.target.value)} 
                  placeholder="https://hooks.slack.com/services/..." 
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" style={ps.btnPrimary} onClick={handleSaveSlack}>Sauvegarder</button>
                {slackWebhookUrl && <button type="button" style={ps.btnSecondary} onClick={handleTestSlack}>Tester la notification</button>}
              </div>
              {slackMessage && <div style={{ ...ps.success, fontSize: 12 }}>{slackMessage}</div>}
            </div>
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid var(--brand-border)", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13, color: "var(--brand-text-primary)", marginBottom: 12 }}>
              <ShieldCheck size={16} style={{ color: "var(--brand-emerald)" }} />
              {t("profile.securitySettings")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid #1F2937", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>{t("profile.mfaTitle")}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{user.mfa_enabled ? t("profile.mfaEnabled") : t("profile.mfaDisabled")}</div>
                  </div>
                  {!user.mfa_enabled && (
                    <button
                      type="button"
                      onClick={handleStartMfaSetup}
                      style={{ ...ps.btnSecondary, minWidth: 160 }}
                      disabled={isConfiguringMfa}
                    >
                      {t("profile.setupMfa")}
                    </button>
                  )}
                </div>
                {user.mfa_enabled ? (
                  <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
                    <div style={{ fontSize: 12, color: "#D1D5DB" }}>{t("profile.mfaDisableInstructions")}</div>
                    <form onSubmit={(e) => { e.preventDefault(); handleDisableMfa(); }} style={{ display: "grid", gap: 12 }}>
                      <input
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="123456"
                        style={ps.input}
                        maxLength={6}
                      />
                      <button type="submit" style={ps.btnSecondary} disabled={isConfiguringMfa}>{t("profile.disableMfa")}</button>
                    </form>
                  </div>
                ) : setupSecret ? (
                  <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
                    <div style={{ fontSize: 12, color: "#D1D5DB" }}>{t("profile.mfaSetupInstructions")}</div>
                    <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
                      <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace", color: "#F9FAFB" }}>
                        <div style={{ marginBottom: 8, fontSize: 12, color: "#9CA3AF" }}>{t("profile.totpDesc")}</div>
                        <div>{setupSecret}</div>
                      </div>
                      {setupUri && (
                        <div style={{ display: "grid", gap: 8 }}>
                          <img
                            src={`https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=${encodeURIComponent(setupUri)}`}
                            alt="MFA QR Code"
                            style={{ width: 220, height: 220, borderRadius: 14, background: "#000" }}
                          />
                          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t("profile.scanQr")}</div>
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t("profile.mfaScanHint")}</div>
                      <form onSubmit={handleEnableMfa} style={{ display: "grid", gap: 12 }}>
                        <input
                          type="text"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value)}
                          placeholder="123456"
                          style={ps.input}
                          maxLength={6}
                        />
                        <button type="submit" style={ps.btnPrimary}>{t("profile.confirmMfaCode")}</button>
                      </form>
                    </div>
                  </div>
                ) : null}
                {mfaMessage && <div style={{ ...ps.success, marginTop: 12 }}>{mfaMessage}</div>}
                {mfaError && <div style={{ ...ps.danger, marginTop: 12 }}>{mfaError}</div>}
              </div>
            </div>
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
