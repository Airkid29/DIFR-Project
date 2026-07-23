const AUTH_TOKEN_KEY = "DFIR-Lab_token";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

export function apiUrl(endpoint: string): string {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
}

export async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Only set Content-Type to application/json if the body is not FormData (e.g. for YARA file upload)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(apiUrl(endpoint), config);

    if (response.status === 401) {
      // Token has expired or is invalid, clear storage and redirect
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // Handle empty or file responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/pdf")) {
      return response.blob();
    }

    return await response.json();
  } catch (error: any) {
    console.error("API Request Error:", error.message || error);
    throw error;
  }
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string, body?: any) =>
    request(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (url: string, body?: any) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: (url: string, body?: any) =>
    request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (url: string) => request(url, { method: "DELETE" }),
};
