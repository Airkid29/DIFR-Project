import React from "react";
import { t } from "../../i18n";

export const authStyles: Record<string, React.CSSProperties> = {
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
  btnLink: { background: "none", border: "none", color: "#3B82F6", fontSize: 11, cursor: "pointer", width: "100%", textAlign: "center" as const, marginTop: 16, padding: 6 },
};

export function AuthShell({ children, title, subtitle, showSteps, step }: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showSteps?: boolean;
  step?: 1 | 2;
}) {
  const s = authStyles;
  const StepDot = ({ active }: { active: boolean }) => (
    <div style={{ width: active ? 20 : 6, height: 6, borderRadius: 3, background: "#3B82F6", opacity: active ? 1 : 0.25, transition: "width .2s" }} />
  );

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <div style={s.left}>
          <div>
            <div style={s.logoWrap}>
              <div style={s.logoIcon}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#F9FAFB", letterSpacing: "-0.3px" }}>{t("common.appName")}</div>
                <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.6px", textTransform: "uppercase" }}>{t("common.appTagline")}</div>
              </div>
            </div>
            <div style={s.headline}>
              {t("auth.headline")}<br />
              <span style={{ color: "#3B82F6" }}>{t("auth.headlineAccent")}</span>
            </div>
            <div style={s.desc}>{t("auth.desc")}</div>
          </div>
          <div style={s.threatBox}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 8 }}>{t("auth.threatLevel")}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#EF4444" }}>ÉLEVÉ</div>
              <div style={{ fontSize: 10, fontWeight: 700, background: "rgba(239,68,68,0.12)", color: "#EF4444", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(239,68,68,0.2)" }}>72 / 100</div>
            </div>
            <div style={{ height: 4, background: "#1F2937", borderRadius: 2 }}>
              <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #EF4444, #F59E0B)", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "#4B5563", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{t("auth.lastScan")}</div>
          </div>
        </div>
        <div style={s.right}>
          <div style={s.formContainer}>
            {showSteps && (
              <div style={s.stepDots}>
                <StepDot active={step === 1} />
                <StepDot active={step === 2} />
              </div>
            )}
            <div style={s.formTitle}>{title}</div>
            <div style={s.formSub}>{subtitle}</div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={authStyles.errorBox}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      {message}
    </div>
  );
}

export function FieldIcon({ path }: { path: string }) {
  return (
    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
