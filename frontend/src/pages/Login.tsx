// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"Google" | "GitHub" | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (res.status === 402) { setStep(2); }
      else if (!res.ok) { const d = await res.json(); setError(d.detail || "Unable to authenticate. Please verify your credentials."); }
      else { const d = await res.json(); localStorage.setItem("forensiguard_token", d.access_token); navigate("/dashboard"); }
    } catch { setError("Unable to connect to the authentication server."); }
    finally { setLoading(false); }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6 || isNaN(Number(mfaCode))) { setError("Please enter a valid 6-digit authentication code."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, mfa_code: mfaCode }) });
      if (!res.ok) { const d = await res.json(); setError(d.detail || "Multi-factor authentication failed."); }
      else { const d = await res.json(); localStorage.setItem("forensiguard_token", d.access_token); navigate("/dashboard"); }
    } catch { setError("Unable to connect to the authentication server."); }
    finally { setLoading(false); }
  };

  const handleOAuthLogin = (provider: "Google" | "GitHub") => {
    setError(""); setLoading(true); setOauthProvider(provider);
    setTimeout(() => {
      setLoading(false); setOauthProvider(null);
      localStorage.setItem("forensiguard_token", `${provider.toLowerCase()}-oauth-demo-token`);
      navigate("/dashboard");
    }, 1500);
  };

  const s: Record<string, React.CSSProperties> = {
    shell: { minHeight: "100vh", background: "#0A0E1A", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Inter', system-ui, sans-serif" },
    card: { display: "flex", width: "100%", maxWidth: 820, borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.6)", border: "1px solid #1F2937" },
    left: { width: 320, flexShrink: 0, background: "linear-gradient(160deg, #0D1526 0%, #111827 100%)", borderRight: "1px solid #1F2937", padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    right: { flex: 1, background: "#0A0E1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px" },
    formContainer: { width: "100%", maxWidth: 320 },
    logoWrap: { display: "flex", alignItems: "center", gap: 10, marginBottom: 40 },
    logoIcon: { width: 36, height: 36, background: "linear-gradient(135deg, #3B82F6, #10B981)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
    headline: { fontSize: 26, fontWeight: 700, color: "#F9FAFB", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 12 },
    desc: { fontSize: 13, color: "#6B7280", lineHeight: 1.6 },
    threatBox: { background: "#111827", border: "1px solid #1F2937", borderRadius: 10, padding: "14px 16px" },
    stepDots: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20 },
    formTitle: { fontSize: 20, fontWeight: 700, color: "#F9FAFB", textAlign: "center", letterSpacing: "-0.4px", marginBottom: 6 },
    formSub: { fontSize: 12, color: "#6B7280", textAlign: "center" as const, lineHeight: 1.5, marginBottom: 28 },
    errorBox: { display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 12, color: "#EF4444" },
    fieldLabel: { fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: "0.7px", textTransform: "uppercase" as const },
    fieldWrap: { position: "relative" as const, marginTop: 6, marginBottom: 16 },
    fieldInput: { width: "100%", padding: "10px 12px 10px 38px", background: "#111827", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" },
    btnPrimary: { width: "100%", padding: 11, background: "#FFFFFF", color: "#0A0E1A", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 },
    dividerRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
    dividerLine: { flex: 1, height: 1, background: "#1F2937" },
    dividerText: { fontSize: 10, fontWeight: 600, color: "#4B5563", textTransform: "uppercase" as const, letterSpacing: "0.8px" },
    oauthGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
    btnOauth: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 12px", background: "#111827", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "#9CA3AF", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
    mfaInput: { width: "100%", padding: "12px", background: "#111827", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 22, fontFamily: "'JetBrains Mono', monospace", outline: "none", textAlign: "center" as const, letterSpacing: 8, marginTop: 6, marginBottom: 8 },
    mfaHint: { fontSize: 11, color: "#4B5563", textAlign: "center" as const, lineHeight: 1.6, marginBottom: 20 },
    btnBack: { background: "none", border: "none", color: "#6B7280", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" as const, marginTop: 10, padding: 6 },
  };

  const StepDot = ({ active }: { active: boolean }) => (
    <div style={{ width: active ? 20 : 6, height: 6, borderRadius: 3, background: "#3B82F6", opacity: active ? 1 : 0.25, transition: "width .2s" }} />
  );

  const FieldIcon = ({ path }: { path: string }) => (
    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );

  return (
    <div style={s.shell}>
      <div style={s.card}>
        {/* Left panel */}
        <div style={s.left}>
          <div>
            <div style={s.logoWrap}>
              <div style={s.logoIcon}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#F9FAFB", letterSpacing: "-0.3px" }}>ForensiGuard</div>
                <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.6px", textTransform: "uppercase" }}>SOC Platform</div>
              </div>
            </div>
            <div style={s.headline}>Forensic analysis.<br />Built for <span style={{ color: "#3B82F6" }}>speed.</span></div>
            <div style={s.desc}>Centralized incident response, evidence chain-of-custody, and real-time threat detection in a single console.</div>
          </div>
          <div style={s.threatBox}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 8 }}>Current threat level</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#EF4444" }}>HIGH</div>
              <div style={{ fontSize: 10, fontWeight: 700, background: "rgba(239,68,68,0.12)", color: "#EF4444", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(239,68,68,0.2)" }}>72 / 100</div>
            </div>
            <div style={{ height: 4, background: "#1F2937", borderRadius: 2 }}>
              <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #EF4444, #F59E0B)", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "#4B5563", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>Last scan: 4 min ago · 3 active incidents</div>
          </div>
        </div>

        {/* Right panel */}
        <div style={s.right}>
          <div style={s.formContainer}>
            <div style={s.stepDots}>
              <StepDot active={step === 1} />
              <StepDot active={step === 2} />
            </div>
            <div style={s.formTitle}>{step === 1 ? "Welcome back" : "Two-factor auth"}</div>
            <div style={s.formSub}>
              {loading && oauthProvider ? `Connecting with ${oauthProvider}...` : step === 1 ? "Sign in to your analyst console" : "Enter your authenticator code to continue"}
            </div>
            {error && (
              <div style={s.errorBox}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleCredentialsSubmit}>
                <div style={s.fieldLabel}>Email address</div>
                <div style={s.fieldWrap}>
                  <FieldIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="analyst@forensiguard.com" style={s.fieldInput} disabled={loading} required />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={s.fieldLabel}>Password</div>
                  <button type="button" style={{ fontSize: 10, fontWeight: 600, color: "#3B82F6", background: "none", border: "none", cursor: "pointer" }}>Forgot password?</button>
                </div>
                <div style={s.fieldWrap}>
                  <FieldIcon path="M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={s.fieldInput} disabled={loading} required />
                </div>
                <button type="submit" style={s.btnPrimary} disabled={loading}>
                  {loading && !oauthProvider ? <span>Signing in...</span> : <><span>Sign in</span><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>}
                </button>
                <div style={s.dividerRow}>
                  <div style={s.dividerLine} /><div style={s.dividerText}>Or continue with</div><div style={s.dividerLine} />
                </div>
                <div style={s.oauthGrid}>
                  {(["Google", "GitHub"] as const).map(p => (
                    <button key={p} type="button" onClick={() => handleOAuthLogin(p)} style={s.btnOauth} disabled={loading}>
                      {p === "Google" ? (
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                      ) : (
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="#9CA3AF"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit}>
                <div style={s.fieldLabel}>TOTP security code</div>
                <input type="text" maxLength={6} value={mfaCode} onChange={e => setMfaCode(e.target.value)} placeholder="000000" style={s.mfaInput} disabled={loading} autoFocus required />
                <div style={s.mfaHint}>Enter the 6-digit code from your authenticator app to verify your session.</div>
                <button type="submit" style={{ ...s.btnPrimary, marginBottom: 0 }} disabled={loading}>
                  {loading ? <span>Verifying...</span> : <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><span>Verify and sign session</span></>}
                </button>
                <button type="button" onClick={() => { setStep(1); setError(""); setMfaCode(""); }} style={s.btnBack} disabled={loading}>← Back to credentials</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}