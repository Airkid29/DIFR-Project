import { apiUrl } from "./api";

export type OAuthProvider = "google" | "github";
export type OAuthMode = "login" | "register";

const REDIRECT_PATH = "/auth/callback";

export function getOAuthRedirectUri(): string {
  return `${window.location.origin}${REDIRECT_PATH}`;
}

export async function startOAuth(provider: OAuthProvider, mode: OAuthMode): Promise<void> {
  const redirectUri = getOAuthRedirectUri();
  sessionStorage.setItem("oauth_mode", mode);
  sessionStorage.setItem("oauth_provider", provider);

  const res = await fetch(
    apiUrl(
      `/api/auth/oauth/${provider}/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`,
    ),
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Connexion OAuth indisponible.");
  }

  const data = await res.json();
  window.location.href = data.authorization_url;
}

export async function completeOAuthCallback(
  code: string,
  state: string,
): Promise<{ access_token: string }> {
  const provider = sessionStorage.getItem("oauth_provider");
  if (!provider) {
    throw new Error("Fournisseur OAuth introuvable.");
  }

  const res = await fetch(apiUrl("/api/auth/oauth/callback"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      code,
      state,
      redirect_uri: getOAuthRedirectUri(),
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Échec de la connexion OAuth.");
  }

  sessionStorage.removeItem("oauth_mode");
  sessionStorage.removeItem("oauth_provider");
  return res.json();
}
