import Image from "next/image";
import Link from "next/link";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { ArrowUpRight } from "lucide-react";
import type { fallbackServices } from "@/lib/content";

type Service = (typeof fallbackServices)[number];

export function ServicesShowcase({ services }: { services: Service[] }) {
  return (
    <section className="section-pad bg-soft">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Services"
          title="A complete exhibition ecosystem"
          description="From first concept to final debrief — design, build, production, people, and programme leadership under one refined standard."
        />
      </div>

      <div className="mt-16 space-y-0">
        {services.map((service, index) => {
          const reverse = index % 2 === 1;
          return (
            <article
              key={service.slug}
              className="border-t border-line"
            >
              <div className={`container-premium grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 ${reverse ? "" : ""}`}>
                <FadeUp className={reverse ? "lg:order-2" : ""}>
                  <div className="relative aspect-[16/11] overflow-hidden image-zoom">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </FadeUp>
                <FadeUp delay={0.1} className={reverse ? "lg:order-1" : ""}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-pink">
                    0{index + 1}
                  </p>
                  <h3 className="font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">
                    {service.title}
                  </h3>
                  {service.tagline && (
                    <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted">
                      {service.tagline}
                    </p>
                  )}
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pink transition hover:text-pink-soft"
                  >
                    Explore service <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </FadeUp>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
