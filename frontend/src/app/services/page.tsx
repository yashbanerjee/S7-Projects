import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackServices, images, applyServiceStockImages, resolveServiceImage } from "@/lib/content";
import { siteConfig } from "@/lib/brand";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exhibition management, stand design & build, project management, event staffing, production, creative branding, and future-ready capabilities from Project S7.",
  alternates: { canonical: "/services" },
};

async function getServices() {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/services`, { next: { revalidate: 0 } });
    const json = await res.json();
    const list = json.data?.length ? json.data : fallbackServices;
    return applyServiceStockImages(list);
  } catch {
    return applyServiceStockImages(fallbackServices);
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Precision services for landmark live experiences"
        description="Engage Project S7 for a single discipline or a full turnkey programme. Every service shares the same craft standard."
        image={images.expo}
      />

      <section className="section-pad bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Capabilities"
            title="Choose the depth of partnership"
            description="Each service page details overview, process, benefits, and galleries — all ready for production-quality delivery."
          />
          <div className="mt-16 space-y-20">
            {services.map((s: (typeof fallbackServices)[number], i: number) => (
              <FadeUp key={s.slug}>
                <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={`relative aspect-[16/11] overflow-hidden image-zoom ${i % 2 ? "lg:order-2" : ""}`}>
                    <Image
                      src={resolveServiceImage(s.slug, s.image)}
                      alt={s.title}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={i % 2 ? "lg:order-1" : ""}>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">
                      Service 0{i + 1}
                    </p>
                    <h2 className="font-display mt-4 text-3xl tracking-tight md:text-5xl">{s.title}</h2>
                    {s.tagline && (
                      <p className="mt-3 text-sm uppercase tracking-[0.16em] text-muted">{s.tagline}</p>
                    )}
                    <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{s.description}</p>
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pink transition hover:text-pink-soft"
                    >
                      View service <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
