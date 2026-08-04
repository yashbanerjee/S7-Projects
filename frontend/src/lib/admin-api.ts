import { siteConfig } from "@/lib/brand";

const TOKEN_KEY = "s7_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(json = true): HeadersInit {
  const token = getToken();
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...authHeaders(!(init?.body instanceof FormData)),
      ...init?.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
      window.location.href = "/admin/login";
    }
    throw new Error(json.message || "Unauthorized");
  }
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json as T;
}
