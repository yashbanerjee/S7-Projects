"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminFetch, getToken, clearToken } from "@/lib/admin-api";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    adminFetch("/auth/me")
      .then(() => setReady(true))
      .catch(() => {
        clearToken();
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  if (!ready && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft text-sm text-muted">
        Checking session…
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
