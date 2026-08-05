"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isAdmin) return null;

  const isHome = pathname === "/";
  // Light solid bar whenever scrolled, on inner pages, or mobile menu open
  const solid = scrolled || !isHome || open;
  // Dark hero: white chrome; solid bar: dark chrome
  const light = !solid;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-black/5 bg-white/95 py-3 shadow-sm backdrop-blur-md"
            : "bg-gradient-to-b from-black/55 via-black/25 to-transparent py-5"
        )}
      >
        <div className="container-premium flex items-center justify-between gap-6">
          <Link
            href="/"
            className="group relative z-50 flex items-center gap-2.5"
            aria-label="S7 Home"
          >
            {/* Creative monogram: script S + bold 7 with brand accent orbit */}
            <span
              className={cn(
                "relative inline-flex h-11 w-11 items-center justify-center md:h-12 md:w-12",
                "rounded-full border transition duration-500",
                light
                  ? "border-white/35 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] group-hover:border-pink group-hover:bg-pink/15"
                  : "border-line bg-soft group-hover:border-pink group-hover:bg-pink-muted"
              )}
            >
              <span
                className={cn(
                  "font-display text-[1.35rem] leading-none tracking-tight md:text-[1.45rem]",
                  light ? "text-white" : "text-ink"
                )}
              >
                <span className="inline-block origin-bottom -skew-x-6 font-semibold italic text-pink">
                  S
                </span>
                <span className="font-semibold">7</span>
              </span>
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-pink shadow-[0_0_10px_rgba(196,32,94,0.65)] transition group-hover:scale-125"
              />
            </span>
            <span className="sr-only">S7</span>
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-1 lg:flex",
              light ? "text-white" : "text-ink"
            )}
            aria-label="Primary"
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors",
                    light
                      ? active
                        ? "text-white drop-shadow-sm"
                        : "text-white/90 hover:text-white"
                      : active
                        ? "text-pink"
                        : "text-ink/75 hover:text-pink"
                  )}
                  style={light ? { color: active ? "#ffffff" : "rgba(255,255,255,0.9)" } : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 origin-left rounded-full transition-transform duration-300",
                      light ? "bg-white" : "bg-pink",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className={cn(
                "hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition",
                light
                  ? "bg-white text-ink hover:bg-pink hover:text-white"
                  : "btn-pink bg-pink text-white hover:bg-pink-soft hover:text-white"
              )}
            >
              Make an Enquiry
            </Link>
            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden",
                light ? "border-white/40 text-white" : "border-line text-ink"
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-8 pb-12 pt-28">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {siteConfig.nav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.45 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "font-display block border-l-2 py-3 pl-4 text-4xl tracking-tight transition sm:text-5xl",
                          active
                            ? "border-pink text-pink"
                            : "border-transparent text-ink hover:text-pink"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-4"
              >
                <Link
                  href="/quote"
                  className="btn-pink inline-flex rounded-full bg-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-pink-soft hover:text-white"
                >
                  Make an Enquiry
                </Link>
                <p className="text-sm text-muted">{siteConfig.email}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
