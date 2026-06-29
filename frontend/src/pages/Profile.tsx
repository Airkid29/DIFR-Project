// PROFILE PAGE
import React, { useState } from "react";
import { User, Smartphone, ShieldCheck, Clock3 } from "lucide-react";

export default function Profile() {
  const [mfaActive, setMfaActive] = useState(true);
  const [name, setName] = useState("R. Jenkins");
  const [email] = useState("r.jenkins@forensiguard.com");
  const [showQrCode, setShowQrCode] = useState(false);
  const [totpInput, setTotpInput] = useState("");
  const [mfaMessage, setMfaMessage] = useState("");
  const [accountMessage, setAccountMessage] = useState("");

  const handleSaveAccount = () => {
    setAccountMessage("Account details saved successfully.");
    window.setTimeout(() => setAccountMessage(""), 3200);
  };

  const s: Record<string, React.CSSProperties> = {
    shell: { display: "flex", flexDirection: "column" as const, gap: 24, maxWidth: 1100, margin: "0 auto" },
    banner: { display: "flex", flexDirection: "column" as const, gap: 8 },
    bannerTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 34, color: "#F9FAFB", letterSpacing: -1, marginBottom: 12 },
    bannerDesc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.7 },
    grid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" },
    card: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    cardTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 16 },
    label: { fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: 0.7, textTransform: "uppercase" as const, marginBottom: 8, display: "block" },
    input: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 13, outline: "none" },
    btn: { width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
    btnSecondary: { padding: "10px 16px", background: "#FFFFFF", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer", fontSize: 13 },
    mfaBox: { background: "#111827", border: "1px solid #1F2937", borderRadius: 10, padding: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
    mfaText: { flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 },
    mfaLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#F9FAFB" },
    mfaDesc: { fontSize: 13, color: "#9CA3AF", lineHeight: 1.6, marginTop: 4 },
    qrCode: { width: 128, height: 128, background: "#fff", padding: 8, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
    qrPattern: { width: "100%", height: "100%", background: "repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)", opacity: 0.8 },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 },
    statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid #1F2937", borderRadius: 10, padding: 14 }
  };

  const handleToggleMfa = () => {
    if (mfaActive) {
      setMfaActive(false);
      setMfaMessage("MFA was disabled successfully.");
    } else {
      setShowQrCode(true);
      setTotpInput("");
      setMfaMessage("");
    }
  };

  const handleValidateMfaSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpInput.length === 6 && !isNaN(Number(totpInput))) {
      setMfaActive(true);
      setShowQrCode(false);
      setMfaMessage("MFA activated successfully.");
    } else {
      alert("Invalid code. Please input the 6 digits from your authenticator app.");
    }
  };

  const activity = [
    { title: "Case escalation reviewed", time: "10 mins ago" },
    { title: "Evidence hash verified", time: "42 mins ago" },
    { title: "MFA policy updated", time: "Today, 08:15" }
  ];

  return (
    <div style={s.shell}>
      <div style={s.banner}>
        <h1 style={s.bannerTitle}>User Account Profile</h1>
        <p style={s.bannerDesc}>Configure credentials, security controls, and review analyst activity in a polished operations-ready view.</p>
      </div>

      <div style={s.statGrid}>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Role</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginTop: 6 }}>Administrator</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Security Level</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981", marginTop: 6 }}>Tier 3</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280" }}>Last login</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#3B82F6", marginTop: 6 }}>14 min ago</div>
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: "rgba(59, 130, 246, 0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>{name}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>System Administrator</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <span style={s.label}>Email Address</span>
              <div style={{ background: "#0A0E1A", padding: 12, borderRadius: 8, fontSize: 13, color: "#F9FAFB", fontFamily: "'JetBrains Mono', monospace" }}>{email}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <span style={s.label}>Edit Full Name</span>
              <input type="text" style={s.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button type="button" style={s.btn} onClick={handleSaveAccount} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>Save Account Details</button>
            {accountMessage && <div style={{ marginTop: 12, fontSize: 12, color: "#10B981" }}>{accountMessage}</div>}
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>Multi-Factor Authentication</h3>

          {mfaMessage && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontSize: 13, marginBottom: 16 }}>
              {mfaMessage}
            </div>
          )}

          <div style={s.mfaBox}>
            <div style={s.mfaText}>
              <div style={s.mfaLabel}>
                <Smartphone size={16} style={{ color: "#3B82F6" }} />
                <span>TOTP Authentication</span>
              </div>
              <p style={s.mfaDesc}>Protects the account with a dynamic verification code from authenticator apps.</p>
            </div>
            <button
              onClick={handleToggleMfa}
              style={{
                padding: "10px 16px",
                background: mfaActive ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                color: mfaActive ? "#EF4444" : "#10B981",
                border: mfaActive ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              {mfaActive ? "Deactivate" : "Activate"}
            </button>
          </div>

          {showQrCode && (
            <div style={{ marginTop: 16, padding: 16, background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={s.qrCode}>
                  <div style={s.qrPattern} />
                </div>
                <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
                  <div style={{ color: "#3B82F6", fontWeight: 700, fontSize: 12, textTransform: "uppercase", marginBottom: 8 }}>Scan QR Code</div>
                  <p>1. Scan with your authenticator app</p>
                  <p>2. Input the 6-digit code below</p>
                </div>
              </div>
              <form onSubmit={handleValidateMfaSetup} style={{ display: "flex", gap: 12 }}>
                <input type="text" maxLength={6} placeholder="000000" style={{ width: 110, padding: 12, background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, textAlign: "center", fontSize: 20, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 8, color: "#F9FAFB" }} value={totpInput} onChange={(e) => setTotpInput(e.target.value)} required />
                <button type="submit" style={s.btnSecondary}>Confirm</button>
              </form>
            </div>
          )}

          <div style={{ marginTop: 16, borderTop: "1px solid #1F2937", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#F9FAFB", fontWeight: 700 }}>
              <ShieldCheck size={16} style={{ color: "#10B981" }} />
              <span>Latest security activities</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {activity.map((item) => (
                <div key={item.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", border: "1px solid #1F2937", borderRadius: 8, padding: 10 }}>
                  <span style={{ fontSize: 12, color: "#F9FAFB" }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 6 }}><Clock3 size={12} />{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}