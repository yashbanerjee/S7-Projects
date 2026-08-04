import Image from "next/image";
import Link from "next/link";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import type { fallbackIndustries } from "@/lib/content";

type I = (typeof fallbackIndustries)[number];

export function IndustriesGrid({ items }: { items: I[] }) {
  return (
    <section className="section-pad bg-white">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Industries"
          title="Sector expertise with tailored experiences"
          description="We translate sector nuance into spatial design, protocol, hospitality, and operational systems that feel native to each audience."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <FadeUp key={item.slug} delay={(i % 4) * 0.05}>
              <Link href={`/industries#${item.slug}`} className="group relative block aspect-[4/5] overflow-hidden image-zoom">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-2xl tracking-tight">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/75 opacity-0 transition duration-500 group-hover:opacity-100">
                    {item.description}
                  </p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
