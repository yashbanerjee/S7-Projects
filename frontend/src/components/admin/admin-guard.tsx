"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { siteConfig } from "@/lib/brand";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("s7_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetch(`${siteConfig.apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("unauth");
      })
      .catch(() => {
        localStorage.removeItem("s7_token");
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  return <AdminShell>{children}</AdminShell>;
}
