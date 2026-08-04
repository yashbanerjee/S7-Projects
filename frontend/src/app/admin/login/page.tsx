"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { siteConfig } from "@/lib/brand";
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
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Login failed");
      localStorage.setItem("s7_token", json.token);
      router.push("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
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
              className="w-full border-b border-line py-3 outline-none focus:border-pink"
              {...register("password")}
            />
          </label>
          {error && <p className="text-sm text-pink">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
