"use client";

import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";
import { images, heroVideo } from "@/lib/content";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* Cinematic event-stage video (Pexels: illuminated venue / production) */}
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={images.stage}
          aria-hidden
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Brand-readable overlays — keep luxury depth without killing the video */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(17,17,17,0.78) 0%, rgba(17,17,17,0.42) 45%, rgba(196,32,94,0.18) 100%), linear-gradient(to top, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.2) 45%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-36 md:pb-24 md:pt-40">
        <div className="container-premium">
          <FadeUp>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Project S7 · Events & Exhibitions
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display max-w-5xl text-balance text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Experiences that elevate brands
            </h1>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Exhibition management, stand architecture, and event production for organisations that expect luxury craftsmanship and flawless delivery.
            </p>
          </FadeUp>
          <FadeUp delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-pink hover:text-white"
              >
                Make an Enquiry
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-ink"
              >
                Request Consultation
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="container-premium mt-16 flex items-center justify-between border-t border-white/20 pt-6 text-white/70">
          <p className="text-xs uppercase tracking-[0.25em]">Scroll to explore</p>
          <ArrowDownRight className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
}
