import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { t } from "../i18n";
import { AuthShell, AuthError, FieldIcon, authStyles } from "../components/auth/AuthShell";
import OAuthButtons from "../components/auth/OAuthButtons";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(t("auth.allFieldsRequired"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.detail || t("auth.allFieldsRequired"));
      } else {
        navigate("/login");
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
      : t("auth.registerSubtitle");

  return (
    <AuthShell title={t("auth.createAccount")} subtitle={subtitle}>
      <AuthError message={error} />

      <form onSubmit={handleSubmit}>
        <div style={authStyles.fieldLabel}>{t("common.fullName")}</div>
        <div style={authStyles.fieldWrap}>
          <FieldIcon path="M16 7a4 4 0 10-8 0 4 4 0 100 8 0 4 4 0 10-8 0 4 4 0 100 8 0" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            style={authStyles.fieldInput}
            disabled={loading}
            required
          />
        </div>

        <div style={authStyles.fieldLabel}>{t("common.email")}</div>
        <div style={authStyles.fieldWrap}>
          <FieldIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@forensiguard.com"
            style={authStyles.fieldInput}
            disabled={loading}
            required
          />
        </div>

        <div style={authStyles.fieldLabel}>{t("common.password")}</div>
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

        <div style={authStyles.fieldLabel}>{t("common.confirmPassword")}</div>
        <div style={authStyles.fieldWrap}>
          <FieldIcon path="M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={authStyles.fieldInput}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" style={authStyles.btnPrimary} disabled={loading}>
          {loading && !oauthProvider ? (
            <span>{t("common.signingUp")}</span>
          ) : (
            <>
              <span>{t("common.signUp")}</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0A0E1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        <OAuthButtons
          mode="register"
          loading={loading}
          onError={setError}
          onLoadingChange={(isLoading, provider) => {
            setLoading(isLoading);
            setOauthProvider(provider ?? null);
          }}
        />
      </form>

      <Link to="/login" style={{ ...authStyles.btnLink, display: "block", textDecoration: "none" }}>
        {t("auth.alreadyHaveAccount")}
      </Link>
    </AuthShell>
  );
}
