"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Images,
  MessageSquare,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  FolderOpen,
  Users,
  Quote,
} from "lucide-react";
import { siteConfig } from "@/lib/brand";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/quotes", label: "Quotes", icon: Quote },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/jobs", label: "Jobs", icon: Users },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonials", icon: FileText },
  { href: "/admin/media", label: "Media", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = () => {
    localStorage.removeItem("s7_token");
    fetch(`${siteConfig.apiUrl}/auth/logout`, { method: "POST", credentials: "include" }).catch(
      () => undefined
    );
    router.push("/admin/login");
  };

  return (
    <div className="admin-shell bg-soft min-h-screen">
      <aside className="border-r border-line bg-white p-6">
        <Link href="/admin" className="font-display text-lg tracking-tight">
          Project S7 Admin
        </Link>
        <nav className="mt-10 space-y-1" aria-label="Admin">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active ? "bg-pink-muted text-pink" : "text-muted hover:bg-soft hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-10 flex items-center gap-2 px-3 text-sm text-muted hover:text-pink"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <div className="min-w-0 p-6 md:p-10">{children}</div>
    </div>
  );
}
