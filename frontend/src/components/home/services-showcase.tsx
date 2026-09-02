import Image from "next/image";
import Link from "next/link";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { approvedServices } from "@/lib/brief-content";
import { serviceImages } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export function ServicesShowcase() {
  return (
    <section className="section-pad bg-soft" id="services">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Services"
          title="Events, exhibitions, stands & project management"
          description="Five focused disciplines — delivered with creative excellence and operational precision for corporate, government and international programmes."
        />
      </div>

      <div className="mt-16">
        {approvedServices.map((service, index) => {
          const reverse = index % 2 === 1;
          const image = serviceImages[service.slug];

          return (
            <article key={service.slug} className="border-t border-line/80">
              <div className="container-premium grid items-center gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
                <FadeUp className={reverse ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                  <div className="relative aspect-[16/11] overflow-hidden image-zoom lg:aspect-[16/10]">
                    <Image
                      src={image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                  </div>
                </FadeUp>

                <FadeUp delay={0.08} className={reverse ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-pink">
                    Service {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-3xl tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                    {service.title}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{service.description}</p>

                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink">
                      {service.slug === "event-staffing" ? "Staffing Solutions" : "Services Include"}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {service.features.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pink" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link
                      href={service.cta.href}
                      className={
                        service.cta.prominent
                          ? "inline-flex items-center gap-2 rounded-full bg-pink px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md shadow-pink/20 transition hover:bg-pink-soft"
                          : "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pink transition hover:text-pink-soft"
                      }
                    >
                      {service.cta.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm font-medium text-muted underline-offset-4 transition hover:text-ink hover:underline"
                    >
                      View service details
                    </Link>
                  </div>
                </FadeUp>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
