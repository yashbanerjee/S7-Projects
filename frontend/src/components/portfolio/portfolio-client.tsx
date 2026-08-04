"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { fallbackPortfolio } from "@/lib/content";

type Item = (typeof fallbackPortfolio)[number];

const filters = ["All", "Events", "Exhibitions", "Corporate", "Booths"] as const;

export function PortfolioClient({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((i) => i.category.toLowerCase() === filter.toLowerCase());
  }, [filter, items]);

  return (
    <section className="section-pad bg-white">
      <div className="container-premium">
        <div className="mb-12 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition",
                filter === f
                  ? "border-pink bg-pink text-white"
                  : "border-line text-muted hover:border-pink hover:text-pink"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {filtered.map((item, i) => (
            <FadeUp key={item.slug} delay={(i % 3) * 0.05} className="mb-6 break-inside-avoid">
              <Link href={`/portfolio/${item.slug}`} className="group block">
                <div
                  className={cn(
                    "relative overflow-hidden image-zoom",
                    i % 4 === 0 ? "aspect-[4/5]" : i % 4 === 1 ? "aspect-[16/11]" : "aspect-[3/4]"
                  )}
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

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
