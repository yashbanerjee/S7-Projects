"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";
import type { fallbackPortfolio } from "@/lib/content";
import { images } from "@/lib/content";

type Item = (typeof fallbackPortfolio)[number];

export function PortfolioClient({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <section className="section-pad bg-white">
        <div className="container-premium">
          <FadeUp>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative aspect-[16/11] overflow-hidden image-zoom">
                <Image
                  src={images.expo}
                  alt="Premium exhibition environment placeholder"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">Coming soon</p>
                <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
                  Project showcase in preparation
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">
                  Our portfolio of exhibitions, stands, and corporate events will be published here as projects
                  are approved for public release. In the meantime, speak with our team about your programme.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/quote"
                    className="inline-flex rounded-full bg-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pink-soft"
                  >
                    Get a Quote
                  </Link>
                  <Link
                    href="/contact?intent=consultation"
                    className="inline-flex rounded-full border border-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pink transition hover:bg-pink hover:text-white"
                  >
                    Request a Consultation
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad bg-white">
      <div className="container-premium">
        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {items.map((item, i) => (
            <FadeUp key={item.slug} delay={(i % 3) * 0.05} className="mb-6 break-inside-avoid">
              <Link href={`/portfolio/${item.slug}`} className="group block">
                <div
                  className={`relative overflow-hidden image-zoom ${
                    i % 4 === 0 ? "aspect-[4/5]" : i % 4 === 1 ? "aspect-[16/11]" : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">{item.category}</p>
                    <h2 className="font-display mt-2 text-xl tracking-tight md:text-2xl">{item.title}</h2>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
