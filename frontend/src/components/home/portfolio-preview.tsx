import Image from "next/image";
import Link from "next/link";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import type { fallbackPortfolio } from "@/lib/content";

type Item = (typeof fallbackPortfolio)[number];

export function PortfolioPreview({ items }: { items: Item[] }) {
  const list = items.slice(0, 6);

  return (
    <section className="section-pad bg-soft">
      <div className="container-premium flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected work"
          description="A glimpse of environments, exhibitions, and brand moments shaped with Project S7 craft."
        />
        <FadeUp>
          <Button href="/portfolio" variant="outline">
            View All Projects
          </Button>
        </FadeUp>
      </div>

      <div className="container-premium mt-14 grid gap-6 md:grid-cols-2">
        {list.map((item, i) => (
          <FadeUp key={item.slug} delay={i * 0.08}>
            <Link href={`/portfolio/${item.slug}`} className="group block">
              <div className={`relative overflow-hidden image-zoom ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[16/11]"}`}>
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-90 transition group-hover:from-ink/80" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/70">{item.category}</p>
                  <h3 className="font-display mt-2 text-2xl tracking-tight md:text-3xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/75">
                    {item.location} · {item.year}
                  </p>
                </div>
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
