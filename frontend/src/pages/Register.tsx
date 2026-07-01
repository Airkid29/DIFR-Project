import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, UserCircle } from "lucide-react";
import { apiUrl } from "../utils/api";
import { t } from "../i18n";
import { AuthShell, AuthError, FieldIcon, authStyles } from "../components/auth/AuthShell";
import OAuthButtons from "../components/auth/OAuthButtons";

type AccountType = "professional" | "enterprise";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !accountType) {
      setError(t("auth.allFieldsRequired"));
      return;
    }
    if (accountType === "enterprise" && !organizationName.trim()) {
      setError(t("auth.orgRequired"));
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
        body: JSON.stringify({
          name,
          email,
          password,
          account_type: accountType,
          organization_name: accountType === "enterprise" ? organizationName : null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.detail || t("auth.registerFailed"));
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
      : step === 1
        ? t("auth.chooseAccountType")
        : accountType === "enterprise"
          ? t("auth.registerEnterpriseSubtitle")
          : t("auth.registerProfessionalSubtitle");

  const typeCard = (type: AccountType, icon: React.ReactNode, title: string, desc: string) => (
    <button
      type="button"
      onClick={() => { setAccountType(type); setStep(2); setError(""); }}
      style={{
        ...authStyles.btnOauth,
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 16,
        textAlign: "left",
        width: "100%",
        borderColor: accountType === type ? "#3B82F6" : "#1F2937",
        background: accountType === type ? "rgba(59,130,246,0.08)" : "#111827",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, color: "#F9FAFB" }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <span style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{desc}</span>
    </button>
  );

  return (
    <AuthShell title={step === 1 ? t("auth.createAccount") : t("auth.completeRegistration")} subtitle={subtitle} showBackHome>
      <AuthError message={error} />

      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {typeCard(
            "professional",
            <UserCircle size={20} color="#3B82F6" />,
            t("auth.professionalAccount"),
            t("auth.professionalDesc"),
          )}
          {typeCard(
            "enterprise",
            <Building2 size={20} color="#10B981" />,
            t("auth.enterpriseAccount"),
            t("auth.enterpriseDesc"),
          )}
          <Link to="/login" style={{ ...authStyles.btnLink, display: "block", textDecoration: "none" }}>
            {t("auth.alreadyHaveAccount")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={() => { setStep(1); setError(""); }}
            style={{ ...authStyles.btnBack, marginBottom: 12, textAlign: "left" }}
          >
            {t("auth.changeAccountType")}
          </button>

          {accountType === "enterprise" && (
            <>
              <div style={authStyles.fieldLabel}>{t("auth.organizationName")}</div>
              <div style={authStyles.fieldWrap}>
                <FieldIcon path="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Security SAS"
                  style={authStyles.fieldInput}
                  disabled={loading}
                  required
                />
              </div>
            </>
          )}

          <div style={authStyles.fieldLabel}>{t("common.fullName")}</div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" style={authStyles.fieldInput} disabled={loading} required />
          </div>

          <div style={authStyles.fieldLabel}>{t("common.email")}</div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@forensiguard.com" style={authStyles.fieldInput} disabled={loading} required />
          </div>

          <div style={authStyles.fieldLabel}>{t("common.password")}</div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={authStyles.fieldInput} disabled={loading} required />
          </div>

          <div style={authStyles.fieldLabel}>{t("common.confirmPassword")}</div>
          <div style={authStyles.fieldWrap}>
            <FieldIcon path="M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={authStyles.fieldInput} disabled={loading} required />
          </div>

          <button type="submit" style={authStyles.btnPrimary} disabled={loading}>
            {loading && !oauthProvider ? t("common.signingUp") : t("common.signUp")}
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

          <Link to="/login" style={{ ...authStyles.btnLink, display: "block", textDecoration: "none" }}>
            {t("auth.alreadyHaveAccount")}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
