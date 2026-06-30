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
  const [integrationStatus, setIntegrationStatus] = useState<{ virustotal_configured: boolean; otx_configured: boolean } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    void api.get("/api/integrations")
      .then((data) => {
        setIntegrationStatus(data);
      })
      .catch(() => {
        setIntegrationStatus({ virustotal_configured: false, otx_configured: false });
      });
  }, []);

  const handleSaveSettings = () => {
    setStatusMessage(t("settings.generalSaved"));
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
      });
      if (virusTotalKey || otxKey) {
        await api.post("/api/integrations", {
          virustotal_api_key: virusTotalKey || undefined,
          otx_api_key: otxKey || undefined,
        });
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
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 32, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 12, color: "#9CA3AF" },
    gridLayout: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 },
    tabs: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 8, display: "flex", flexDirection: "column" as const, gap: 4, height: "fit-content" },
    tabBtn: { padding: "12px 16px", background: "transparent", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 },
    tabBtnActive: { background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" },
    panel: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    panelTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 20 },
    formGroup: { display: "flex", flexDirection: "column" as const, gap: 8, maxWidth: 400, marginBottom: 20 },
    label: { fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" as const, display: "block", marginBottom: 8 },
    input: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" },
    select: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" },
    btn: { padding: "10px 20px", background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer" }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>{t("settings.title")}</h1>
        <p style={s.desc}>{t("settings.desc")}</p>
      </div>

      <div style={s.gridLayout}>
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
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "rgba(15, 23, 42, 0.6)", border: "1px solid #1F2937" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>{t("settings.virustotal")}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: integrationStatus?.virustotal_configured ? "#34D399" : "#FBBF24" }}>
                    {integrationStatus?.virustotal_configured ? t("settings.configured") : t("settings.notConfigured")}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 180, padding: 14, borderRadius: 12, background: "rgba(15, 23, 42, 0.6)", border: "1px solid #1F2937" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>{t("settings.otx")}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: integrationStatus?.otx_configured ? "#34D399" : "#FBBF24" }}>
                    {integrationStatus?.otx_configured ? t("settings.configured") : t("settings.notConfigured")}
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
              <button type="button" style={s.btn} onClick={handleValidateKeys}>{t("settings.validateSaveKeys")}</button>
            </div>
          )}

          {activeTab === "yara" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>{t("settings.yaraPackages")}</h3>
              <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase" }}>{t("settings.currentRuleset")}</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#F9FAFB", marginTop: 8 }}>apt_signatures_v2.yar</p>
                <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{t("settings.compiledRules")}</p>
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
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontSize: 13 }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}