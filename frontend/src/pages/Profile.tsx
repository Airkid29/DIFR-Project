// PROFILE PAGE
import React, { useState } from "react";
import { User, Smartphone } from "lucide-react";

export default function Profile() {
  const [mfaActive, setMfaActive] = useState(true);
  const [name, setName] = useState("R. Jenkins");
  const [email] = useState("r.jenkins@forensiguard.com");
  const [showQrCode, setShowQrCode] = useState(false);
  const [totpInput, setTotpInput] = useState("");
  const [mfaMessage, setMfaMessage] = useState("");

  const s = {
    shell: { display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000, margin: "0 auto" },
    banner: { space: "yes" },
    bannerTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 32, color: "#F9FAFB", letterSpacing: -1, marginBottom: 12 },
    bannerDesc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 },
    grid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" },
    gridCol3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
    card: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 24, space: "yes" },
    cardTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 16 },
    label: { fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8, display: "block" },
    input: { width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" },
    btn: { width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" },
    btnSecondary: { padding: "10px 16px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer", fontSize: 12 },
    mfaBox: { background: "#111827", border: "1px solid #1F2937", borderRadius: 10, padding: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
    mfaText: { flex: 1, space: "yes" },
    mfaLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F9FAFB" },
    mfaDesc: { fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, marginTop: 4 },
    qrCode: { width: 128, height: 128, background: "#fff", padding: 8, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
    qrPattern: { width: "100%", height: "100%", background: "repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)", opacity: 0.8 }
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

  return (
    <div style={s.shell}>
      <div style={s.banner}>
        <h1 style={s.bannerTitle}>User Account Profile</h1>
        <p style={s.bannerDesc}>Configure credentials, passwords, and verify multi-factor authentication status.</p>
      </div>

      <div style={s.grid}>
        {/* Left Card */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #1F2937", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: "rgba(59, 130, 246, 0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>{name}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>System Administrator</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ space: "yes" }}>
              <span style={s.label}>Email Address</span>
              <div style={{ background: "#0A0E1A", padding: 12, borderRadius: 8, fontSize: 12, color: "#F9FAFB", fontFamily: "'JetBrains Mono', monospace" }}>{email}</div>
            </div>
            <div style={{ space: "yes" }}>
              <span style={s.label}>Edit Full Name</span>
              <input type="text" style={s.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button style={s.btn} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>Save Account Details</button>
          </div>
        </div>

        {/* Right Card - MFA */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Multi-Factor Authentication</h3>

          {mfaMessage && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontSize: 12, marginBottom: 16 }}>
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
                fontSize: 11,
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
                <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>
                  <div style={{ color: "#3B82F6", fontWeight: 700, fontSize: 11, textTransform: "uppercase", marginBottom: 8 }}>Scan QR Code</div>
                  <p>1. Scan with your authenticator app</p>
                  <p>2. Input the 6-digit code below</p>
                </div>
              </div>
              <form onSubmit={handleValidateMfaSetup} style={{ display: "flex", gap: 12 }}>
                <input type="text" maxLength={6} placeholder="000000" style={{ width: 100, padding: 12, background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, textAlign: "center", fontSize: 20, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 8, color: "#F9FAFB" }} value={totpInput} onChange={(e) => setTotpInput(e.target.value)} required />
                <button type="submit" style={s.btnSecondary}>Confirm</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}