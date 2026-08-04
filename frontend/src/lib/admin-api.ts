import { siteConfig } from "@/lib/brand";

export function authHeaders(json = true): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("s7_token") : null;
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...init,
    headers: {
      ...authHeaders(!(init?.body instanceof FormData)),
      ...init?.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}
