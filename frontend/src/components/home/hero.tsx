"use client";

import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";
import { heroVideo, heroVideoPoster } from "@/lib/content";
import { heroContent } from "@/lib/brief-content";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroVideoPoster}
          aria-hidden
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(17,17,17,0.78) 0%, rgba(17,17,17,0.42) 45%, rgba(245,45,113,0.22) 100%), linear-gradient(to top, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.15) 50%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-36 md:pb-24 md:pt-40">
        <div className="container-premium">
          <FadeUp>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-pink-soft">
              {heroContent.eyebrow}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display max-w-5xl text-balance text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {heroContent.headline}
            </h1>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/88 md:text-lg">
              {heroContent.supporting}
            </p>
          </FadeUp>
          <FadeUp delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={heroContent.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-pink/30 transition hover:bg-pink-soft"
              >
                {heroContent.primaryCta.label}
              </Link>
              <Link
                href={heroContent.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-ink"
              >
                {heroContent.secondaryCta.label}
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="container-premium mt-16 flex items-center justify-between border-t border-white/20 pt-6 text-white/70">
          <p className="text-xs uppercase tracking-[0.25em]">Events · Exhibitions · Stands · Project Management</p>
          <ArrowDownRight className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </section>
  );
}
