import React from "react";
import { Link } from "react-router-dom";
import { t } from "../../i18n";
import { useSettings } from "../../context/SettingsContext";

export const authStyles: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", background: "var(--brand-abyssal)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-inter)", transition: "background-color 200ms ease" },
  card: { display: "flex", width: "100%", maxWidth: 820, borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.12)", border: "1px solid var(--brand-border)", background: "var(--brand-card)" },
  left: { width: 320, flexShrink: 0, background: "var(--brand-card)", borderRight: "1px solid var(--brand-border)", padding: "40px 32px", flexDirection: "column", justifyContent: "space-between" },
  right: { flex: 1, background: "var(--brand-abyssal)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  formContainer: { width: "100%", maxWidth: 320 },
  logoWrap: { display: "flex", alignItems: "center", gap: 10, marginBottom: 40 },
  headline: { fontSize: 26, fontWeight: 700, color: "var(--brand-text-primary)", fontFamily: "var(--font-outfit)", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 12 },
  desc: { fontSize: 13, color: "var(--brand-text-secondary)", lineHeight: 1.6 },
  threatBox: { background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", borderRadius: 10, padding: "14px 16px" },
  stepDots: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20 },
  formTitle: { fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", fontFamily: "var(--font-outfit)", textAlign: "center", letterSpacing: "-0.4px", marginBottom: 6 },
  formSub: { fontSize: 12, color: "var(--brand-text-secondary)", textAlign: "center" as const, lineHeight: 1.5, marginBottom: 28 },
  errorBox: { display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(255,95,95,0.08)", border: "1px solid rgba(255,95,95,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 12, color: "var(--brand-crimson)" },
  fieldLabel: { fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", letterSpacing: "0.7px", textTransform: "uppercase" as const },
  fieldWrap: { position: "relative" as const, marginTop: 6, marginBottom: 16 },
  fieldInput: { width: "100%", padding: "10px 12px 10px 38px", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 13, fontFamily: "var(--font-mono)", outline: "none" },
  btnPrimary: { width: "100%", padding: 11, background: "var(--brand-text-primary)", color: "var(--brand-abyssal)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, background: "var(--brand-border)" },
  dividerText: { fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.8px" },
  oauthGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  btnOauth: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 12px", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "var(--brand-text-primary)", cursor: "pointer", fontFamily: "var(--font-inter)" },
  mfaInput: { width: "100%", padding: "12px", background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontSize: 22, fontFamily: "var(--font-mono)", outline: "none", textAlign: "center" as const, letterSpacing: 8, marginTop: 6, marginBottom: 8 },
  mfaHint: { fontSize: 11, color: "var(--brand-text-secondary)", textAlign: "center" as const, lineHeight: 1.6, marginBottom: 20 },
  btnBack: { background: "none", border: "none", color: "var(--brand-text-secondary)", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" as const, marginTop: 10, padding: 6 },
  btnLink: { background: "none", border: "none", color: "var(--brand-cyan)", fontSize: 11, cursor: "pointer", width: "100%", textAlign: "center" as const, marginTop: 16, padding: 6 },
};

export function AuthShell({ children, title, subtitle, showSteps, step, showBackHome }: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showSteps?: boolean;
  step?: 1 | 2;
  showBackHome?: boolean;
}) {
  const { theme } = useSettings();
  const s = authStyles;
  const StepDot = ({ active }: { active: boolean }) => (
    <div style={{ width: active ? 20 : 6, height: 6, borderRadius: 3, background: "var(--brand-cyan)", opacity: active ? 1 : 0.25, transition: "width .2s" }} />
  );

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <div style={s.left} className="hidden md:flex flex-col">
          <div>
            <div style={s.logoWrap}>
              <img 
              src={theme === "light" ? "/dfir-lab-logo-white.png" : "/dfir-lab-logo-dark.png"} 
              alt="DFIR-Lab" 
              style={{ height: "26px", width: "auto" }} 
            />
              <span className="beta-badge" style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10.5px",
                letterSpacing: "0.04em",
                color: "var(--brand-amber)",
                border: "1px solid var(--brand-border)",
                background: "var(--theme-white-bg-tint)",
                padding: "2px 7px",
                borderRadius: "100px",
                textTransform: "uppercase"
              }}>Beta</span>
            </div>
            <div style={s.headline}>
              {t("auth.headline")}<br />
              <span style={{ color: "var(--brand-cyan)" }}>{t("auth.headlineAccent")}</span>
            </div>
            <div style={s.desc}>{t("auth.desc")}</div>
          </div>
          <div style={s.threatBox}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 8 }}>{t("auth.threatLevel")}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-crimson)" }}>LEVEL</div>
              <div style={{ fontSize: 10, fontWeight: 700, background: "var(--theme-white-bg-tint)", color: "var(--brand-crimson)", padding: "2px 8px", borderRadius: 99, border: "1px solid var(--brand-border)" }}>72 / 100</div>
            </div>
            <div style={{ height: 4, background: "var(--brand-border)", borderRadius: 2 }}>
              <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, var(--brand-crimson), var(--brand-amber))", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "var(--brand-text-secondary)", marginTop: 6, fontFamily: "var(--font-mono)" }}>{t("auth.lastScan")}</div>
          </div>
        </div>
        <div style={s.right} className="p-6 sm:p-12 flex-1 flex flex-col items-center justify-center bg-brand-abyssal">
          <div style={s.formContainer}>
            {showBackHome && (
              <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--brand-text-secondary)", textDecoration: "none", marginBottom: 16 }}>
                ← {t("auth.backToHome")}
              </Link>
            )}
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
    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="var(--brand-text-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
