"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { siteConfig } from "@/lib/brand";
import { setToken } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${siteConfig.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.message || `Login failed (${res.status})`);
      }
      if (!json.token) throw new Error("No token returned from API");
      setToken(json.token);
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Login failed. Check API URL and that the backend is online."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft px-6">
      <div className="w-full max-w-md border border-line bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.png" alt="Project S7" width={48} height={48} />
          <div>
            <p className="font-display text-xl">Admin</p>
            <p className="text-sm text-muted">Project S7 CMS</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="username"
              className="w-full border-b border-line py-3 outline-none focus:border-pink"
              defaultValue="admin@projects7.com"
              {...register("email")}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full border-b border-line py-3 outline-none focus:border-pink"
              {...register("password")}
            />
          </label>
          {error && (
            <p className="rounded border border-pink/30 bg-pink-muted px-3 py-2 text-sm text-pink">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted">
            API: {siteConfig.apiUrl}
          </p>
        </form>
      </div>
    </div>
  );
}
