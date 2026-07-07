// SETTINGS PAGE
import React, { useState, useEffect } from "react";
import { Sliders, Key, Server } from "lucide-react";
import { api } from "../utils/api";
import { t } from "../i18n";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"general" | "integrations" | "yara">("general");
  const [orgName, setOrgName] = useState("ForensiGuard SOC L1");
  const [retention, setRetention] = useState("90");
  const [virusTotalKey, setVirusTotalKey] = useState("");
  const [otxKey, setOtxKey] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [userSlackWebhookUrl, setUserSlackWebhookUrl] = useState("");
  const [slackTestMessage, setSlackTestMessage] = useState("Test notification from ForensiGuard!");
  const [integrationStatus, setIntegrationStatus] = useState<{ virustotal_configured: boolean; otx_configured: boolean; slack_configured: boolean } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/integrations"),
      api.get("/api/auth/me")
    ])
      .then(([intData, userData]) => {
        setIntegrationStatus(intData);
        setUserSlackWebhookUrl(userData.slack_webhook_url || "");
      })
      .catch(() => {
        setIntegrationStatus({ virustotal_configured: false, otx_configured: false, slack_configured: false });
      });
  }, []);

  const handleSaveSettings = () => {
    setStatusMessage(t("settings.generalSaved"));
  };

  const handleTestSlack = async () => {
    try {
      const response = await api.post("/api/integrations/slack/test", { message: slackTestMessage });
      setStatusMessage(response.message);
    } catch (error: any) {
      setStatusMessage(error.message || t("settings.validateError"));
    }
  };

  const handleSaveUserSlack = async () => {
    try {
      await api.put("/api/auth/me", { slack_webhook_url: userSlackWebhookUrl || null });
      setStatusMessage("Personal Slack webhook saved successfully!");
    } catch (error: any) {
      setStatusMessage(error.message || t("settings.validateError"));
    }
  };

  const handleValidateKeys = async () => {
    try {
      const response = await api.post("/api/integrations/validate", {
        virustotal_api_key: virusTotalKey || undefined,
        otx_api_key: otxKey || undefined,
      });
      setStatusMessage(response.messages.join(" "));
      setIntegrationStatus({
        virustotal_configured: Boolean(response.virustotal),
        otx_configured: Boolean(response.otx),
        slack_configured: integrationStatus?.slack_configured || false,
      });
      if (virusTotalKey || otxKey || slackWebhookUrl) {
        await api.post("/api/integrations", {
          virustotal_api_key: virusTotalKey || undefined,
          otx_api_key: otxKey || undefined,
          slack_webhook_url: slackWebhookUrl || undefined,
        });
        const updatedStatus = await api.get("/api/integrations");
        setIntegrationStatus(updatedStatus);
      }
    } catch (error: any) {
      setStatusMessage(error.message || t("settings.validateError"));
    }
  };

  const handleUploadYara = () => {
    setStatusMessage(t("settings.yaraUploaded"));
  };

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    header: { display: "flex", flexDirection: "column" as const, gap: 8 },
    title: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 700, fontSize: 32, color: "var(--brand-text-primary)", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 12, color: "var(--brand-text-secondary)" },
    gridLayout: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 },
    tabs: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 8, display: "flex", flexDirection: "column" as const, gap: 4, height: "fit-content" },
    tabBtn: { padding: "12px 16px", background: "transparent", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" as const, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 },
    tabBtnActive: { background: "var(--theme-white-bg-tint)", color: "var(--brand-cyan)" },
    panel: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    panelTitle: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--brand-text-primary)", borderBottom: "1px solid var(--brand-border)", paddingBottom: 16, marginBottom: 20 },
    formGroup: { display: "flex", flexDirection: "column" as const, gap: 8, maxWidth: 400, marginBottom: 20 },
    label: { fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" as const, display: "block", marginBottom: 8 },
    input: { width: "100%", padding: "10px 12px", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 12, outline: "none" },
    select: { width: "100%", padding: "10px 12px", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 12, outline: "none" },
    btn: { padding: "10px 20px", background: "var(--brand-text-primary)", border: "none", borderRadius: 8, color: "var(--brand-abyssal)", fontWeight: 700, fontSize: 12, cursor: "pointer" }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>{t("settings.title")}</h1>
        <p style={s.desc}>{t("settings.desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <div style={s.tabs}>
          {[
            { id: "general", label: t("settings.tabGeneral"), icon: Sliders },
            { id: "integrations", label: t("settings.tabIntegrations"), icon: Key },
            { id: "yara", label: t("settings.tabYara"), icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                style={{ ...s.tabBtn, ...(activeTab === tab.id ? s.tabBtnActive : {}) }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={s.panel}>
          {activeTab === "general" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>{t("settings.generalConfig")}</h3>
              <div style={s.formGroup}>
                <label style={s.label}>{t("settings.orgTitle")}</label>
                <input type="text" style={s.input} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>{t("settings.retentionPeriod")}</label>
                <select style={s.select} value={retention} onChange={(e) => setRetention(e.target.value)}>
                  <option value="30">{t("settings.days30")}</option>
                  <option value="90">{t("settings.days90")}</option>
                  <option value="180">{t("settings.days180")}</option>
                  <option value="365">{t("settings.days365")}</option>
                </select>
              </div>
              <button type="button" style={s.btn} onClick={handleSaveSettings}>{t("settings.saveChanges")}</button>
            </div>
          )}

          {activeTab === "integrations" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>{t("settings.threatIntelIntegrations")}</h3>
              
              <div style={{ marginBottom: 24, padding: 16, background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 16, textTransform: "uppercase" }}>Global Integrations</h4>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                  <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-text-secondary)", marginBottom: 8 }}>{t("settings.virustotal")}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: integrationStatus?.virustotal_configured ? "var(--brand-emerald)" : "var(--brand-amber)" }}>
                      {integrationStatus?.virustotal_configured ? t("settings.configured") : t("settings.notConfigured")}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-text-secondary)", marginBottom: 8 }}>{t("settings.otx")}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: integrationStatus?.otx_configured ? "var(--brand-emerald)" : "var(--brand-amber)" }}>
                      {integrationStatus?.otx_configured ? t("settings.configured") : t("settings.notConfigured")}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-text-secondary)", marginBottom: 8 }}>Global Slack</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: integrationStatus?.slack_configured ? "var(--brand-emerald)" : "var(--brand-amber)" }}>
                      {integrationStatus?.slack_configured ? t("settings.configured") : t("settings.notConfigured")}
                    </div>
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>{t("settings.virustotalApiKey")}</label>
                  <input type="password" style={s.input} placeholder="••••••••••••••••••••" value={virusTotalKey} onChange={(e) => setVirusTotalKey(e.target.value)} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>{t("settings.otxApiKey")}</label>
                  <input type="password" style={s.input} placeholder="••••••••••••••••••••" value={otxKey} onChange={(e) => setOtxKey(e.target.value)} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Global Slack Webhook URL</label>
                  <input type="password" style={s.input} placeholder="https://hooks.slack.com/services/..." value={slackWebhookUrl} onChange={(e) => setSlackWebhookUrl(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <button type="button" style={s.btn} onClick={handleValidateKeys}>{t("settings.validateSaveKeys")}</button>
                </div>
              </div>

              <div style={{ marginBottom: 0, padding: 16, background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 16, textTransform: "uppercase" }}>Personal Slack</h4>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                  <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-text-secondary)", marginBottom: 8 }}>Your Slack</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: userSlackWebhookUrl ? "var(--brand-emerald)" : "var(--brand-amber)" }}>
                      {userSlackWebhookUrl ? t("settings.configured") : t("settings.notConfigured")}
                    </div>
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Your Slack Webhook URL</label>
                  <input type="password" style={s.input} placeholder="https://hooks.slack.com/services/..." value={userSlackWebhookUrl} onChange={(e) => setUserSlackWebhookUrl(e.target.value)} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Test Slack Message</label>
                  <input type="text" style={s.input} placeholder="Test notification..." value={slackTestMessage} onChange={(e) => setSlackTestMessage(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" style={s.btn} onClick={handleSaveUserSlack}>Save Personal Slack</button>
                  {(integrationStatus?.slack_configured || userSlackWebhookUrl) && (
                    <button type="button" style={{ ...s.btn, background: "var(--theme-white-bg-tint)", color: "var(--brand-text-primary)", border: "1px solid var(--brand-border)" }} onClick={handleTestSlack}>
                      Test Slack Notification
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "yara" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>{t("settings.yaraPackages")}</h3>
              <div style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "var(--brand-cyan)", textTransform: "uppercase" }}>{t("settings.currentRuleset")}</span>
                <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 12, color: "var(--brand-text-primary)", marginTop: 8 }}>apt_signatures_v2.yar</p>
                <p style={{ fontSize: 10, color: "var(--brand-text-secondary)", marginTop: 4 }}>{t("settings.compiledRules")}</p>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>{t("settings.uploadNewFile")}</label>
                <input type="file" style={{ ...s.input, cursor: "pointer" }} onChange={() => setStatusMessage("")} />
              </div>
              <button type="button" style={s.btn} onClick={handleUploadYara}>{t("settings.uploadCompile")}</button>
            </div>
          )}
        </div>
      </div>
      {statusMessage && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "rgba(95,203,155,0.08)", border: "1px solid rgba(95,203,155,0.2)", color: "var(--brand-cyan)", fontSize: 13 }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}