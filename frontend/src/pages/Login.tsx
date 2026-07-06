import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { t } from "../i18n";
import { AuthShell, AuthError, FieldIcon, authStyles } from "../components/auth/AuthShell";
import OAuthButtons from "../components/auth/OAuthButtons";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("auth.emailRequired"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 402) {
        setStep(2);
      } else if (!res.ok) {
        const d = await res.json();
        setError(d.detail || t("auth.emailRequired"));
      } else {
        const d = await res.json();
        localStorage.setItem("forensiguard_token", d.access_token);
        navigate("/dashboard");
      }
    } catch {
      setError(t("common.serverError"));
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6 || isNaN(Number(mfaCode))) {
      setError(t("auth.mfaInvalid"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mfa_code: mfaCode }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.detail || t("auth.mfaInvalid"));
      } else {
        const d = await res.json();
        localStorage.setItem("forensiguard_token", d.access_token);
        navigate("/dashboard");
      }
    } catch {
      setError(t("common.serverError"));
    } finally {
      setLoading(false);
    }
  };

  const subtitle =
    loading && oauthProvider
      ? t("auth.connectingOAuth", { provider: oauthProvider })
      : step === 1
        ? t("auth.signInSubtitle")
        : t("auth.mfaSubtitle");

  return (
    <AuthShell
      title={step === 1 ? t("auth.welcomeBack") : t("auth.twoFactor")}
      subtitle={subtitle}
      showSteps
      step={step}
      showBackHome
    >
      <AuthError message={error} />

      {step === 1 ? (
        <form onSubmit={handleCredentialsSubmit}>
          <div style={authStyles.fieldLabel}>{t("common.email")}</div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@forensiguard.com"
              style={authStyles.fieldInput}
              disabled={loading}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={authStyles.fieldLabel}>{t("common.password")}</div>
            <button type="button" style={{ fontSize: 10, fontWeight: 600, color: "#3B82F6", background: "none", border: "none", cursor: "pointer" }}>
              {t("auth.forgotPassword")}
            </button>
          </div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={authStyles.fieldInput}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" style={authStyles.btnPrimary} disabled={loading}>
            {loading && !oauthProvider ? (
              <span>{t("common.signingIn")}</span>
            ) : (
              <>
                <span>{t("common.signIn")}</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0A0E1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
          <OAuthButtons
            mode="login"
            loading={loading}
            onError={setError}
            onLoadingChange={(isLoading, provider) => {
              setLoading(isLoading);
              setOauthProvider(provider ?? null);
            }}
          />
          <Link to="/register" style={{ ...authStyles.btnLink, display: "block", textDecoration: "none" }}>
            {t("auth.createAccount")}
          </Link>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit}>
          <div style={authStyles.fieldLabel}>{t("auth.mfaCode")}</div>
          <input
            type="text"
            maxLength={6}
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="000000"
            style={authStyles.mfaInput}
            disabled={loading}
            autoFocus
            required
          />
          <div style={authStyles.mfaHint}>{t("auth.mfaHint")}</div>
          <button type="submit" style={{ ...authStyles.btnPrimary, marginBottom: 0 }} disabled={loading}>
            {loading ? (
              <span>{t("auth.verifying")}</span>
            ) : (
              <>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0A0E1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>{t("auth.verifySession")}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setError("");
              setMfaCode("");
            }}
            style={authStyles.btnBack}
            disabled={loading}
          >
            {t("auth.backToCredentials")}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
