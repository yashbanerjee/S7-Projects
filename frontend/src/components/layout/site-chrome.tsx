"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";

const SmoothScroll = dynamic(
  () =>
    import("@/components/providers/smooth-scroll").then((m) => m.SmoothScroll),
  { ssr: false }
);

const ScrollProgress = dynamic(
  () =>
    import("@/components/layout/scroll-progress").then((m) => m.ScrollProgress),
  { ssr: false }
);

/** Shell UI. Scroll effects are client-only siblings so SSR still renders the page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCta />
    </>
  );
}
