import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";
import { completeOAuthCallback } from "../utils/oauth";
import { AuthShell, AuthError } from "../components/auth/AuthShell";
import { authStyles } from "../components/auth/AuthShell";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(t("auth.oauthCallbackError"));
      setLoading(false);
      return;
    }

    if (!code || !state) {
      setError(t("auth.oauthCallbackMissing"));
      setLoading(false);
      return;
    }

    completeOAuthCallback(code, state)
      .then((data) => {
        localStorage.setItem("forensiguard_token", data.access_token);
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : t("auth.oauthCallbackError"));
        setLoading(false);
      });
  }, [navigate]);

  return (
    <AuthShell
      title={t("common.signIn")}
      subtitle={loading ? t("common.loading") : t("auth.oauthCallbackError")}
    >
      <AuthError message={error} />
      {loading && !error && (
        <div style={{ ...authStyles.btnPrimary, marginBottom: 0, opacity: 0.8 }}>
          {t("common.loading")}
        </div>
      )}
      {error && (
        <button type="button" style={authStyles.btnLink} onClick={() => navigate("/login")}>
          {t("auth.backToCredentials")}
        </button>
      )}
    </AuthShell>
  );
}
