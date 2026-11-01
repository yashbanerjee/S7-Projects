"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/brand";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-pink/20 bg-pink-muted/60">
      <div className="container-premium section-pad">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={80}
                height={80}
                className="h-16 w-auto object-contain md:h-[4.5rem]"
              />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-pink md:text-2xl">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-muted">{siteConfig.tagline}</p>
              </div>
            </Link>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-muted">
              Premium events, exhibitions, bespoke exhibition stands and end-to-end project management.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Navigate</p>
              <ul className="space-y-3">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted transition hover:text-pink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Services</p>
              <ul className="space-y-3">
                {siteConfig.footerServices.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted transition hover:text-pink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Contact</p>
            <ul className="space-y-3 text-muted">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-pink">
                  {siteConfig.email}
                </a>
              </li>
              <li className="max-w-[16rem] leading-relaxed">{siteConfig.address}</li>
            </ul>
            <Link
              href="/quote"
              className="btn-pink mt-8 inline-flex rounded-full bg-pink px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-pink-soft"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Project S7. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-pink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-pink">
              Terms
            </Link>
            <Link href="/admin" className="hover:text-pink">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
