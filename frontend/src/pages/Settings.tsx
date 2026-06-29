// SETTINGS PAGE
import React, { useState } from "react";
import { Sliders, Key, Server } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"general" | "integrations" | "yara">("general");
  const [orgName, setOrgName] = useState("ForensiGuard SOC L1");
  const [retention, setRetention] = useState("90");

  const s = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { space: "yes" },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 32, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 12, color: "#9CA3AF" },
    gridLayout: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 },
    tabs: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", gap: 4, height: "fit-content" },
    tabBtn: { padding: "12px 16px", background: "transparent", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 },
    tabBtnActive: { background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" },
    panel: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 24, space: "yes" },
    panelTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 20 },
    formGroup: { space: "yes", maxWidth: 400, marginBottom: 20 },
    label: { fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 8 },
    input: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" },
    select: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" },
    btn: { padding: "10px 20px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer" }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>System Settings</h1>
        <p style={s.desc}>Manage integrations, API connections, retention schedules, and YARA rule assets.</p>
      </div>

      <div style={s.gridLayout}>
        <div style={s.tabs}>
          {[
            { id: "general", label: "General Setup", icon: Sliders },
            { id: "integrations", label: "Threat Intel APIs", icon: Key },
            { id: "yara", label: "YARA Signatures", icon: Server }
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
              <h3 style={s.panelTitle}>General Configuration</h3>
              <div style={s.formGroup}>
                <label style={s.label}>Organization Title</label>
                <input type="text" style={s.input} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Data Retention Period (Days)</label>
                <select style={s.select} value={retention} onChange={(e) => setRetention(e.target.value)}>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days</option>
                </select>
              </div>
              <button style={s.btn}>Save Changes</button>
            </div>
          )}

          {activeTab === "integrations" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>Threat Intelligence Integrations</h3>
              <div style={s.formGroup}>
                <label style={s.label}>VirusTotal API Key</label>
                <input type="password" style={s.input} placeholder="••••••••••••••••••••" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>AlienVault OTX Key</label>
                <input type="password" style={s.input} placeholder="••••••••••••••••••••" />
              </div>
              <button style={s.btn}>Validate Keys</button>
            </div>
          )}

          {activeTab === "yara" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <h3 style={s.panelTitle}>YARA Rule Packages</h3>
              <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase" }}>Current Ruleset</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#F9FAFB", marginTop: 8 }}>apt_signatures_v2.yar</p>
                <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>120 compiled rules (CobaltStrike, Mimikatz, shellcodes)</p>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Upload New File (.yar / .yara)</label>
                <input type="file" style={{ ...s.input, cursor: "pointer" }} />
              </div>
              <button style={s.btn}>Upload & Compile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}