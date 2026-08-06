"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { siteConfig } from "@/lib/brand";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  if (pathname?.startsWith("/admin")) return null;

  const onSubmit = handleSubmit(() => {
    reset();
    alert("Thank you for subscribing to Project S7 updates.");
  });

  return (
    <footer className="border-t border-line bg-soft">
      <div className="container-premium section-pad">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
              />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-muted">{siteConfig.tagline}</p>
              </div>
            </Link>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
              A luxury partner for corporate exhibitions, stand design & build, and world-class event production — crafted with precision for organisations that expect excellence.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Contact</p>
              <ul className="space-y-3 text-muted">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-pink">
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-pink">
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="max-w-[16rem] leading-relaxed">{siteConfig.address}</li>
              </ul>
              <div className="mt-6 flex gap-4 text-sm">
                <a href={siteConfig.social.linkedin} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={siteConfig.social.instagram} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={siteConfig.social.x} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                  X
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Newsletter</p>
            <p className="mb-5 text-sm leading-relaxed text-muted">
              Occasional insights on exhibitions, production, and brand experiences.
            </p>
            <form onSubmit={onSubmit} className="flex border-b border-ink/20 pb-2">
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                {...register("email")}
              />
              <button type="submit" aria-label="Subscribe" className="text-pink">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </form>
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
