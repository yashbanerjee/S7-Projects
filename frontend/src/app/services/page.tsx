import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import {
  approvedServices,
  filterApprovedServices,
  isApprovedServiceSlug,
} from "@/lib/brief-content";
import { applyServiceStockImages, images, resolveServiceImage, type PublicService } from "@/lib/content";
import { siteConfig } from "@/lib/brand";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exhibition management, exhibition stand design & build, project management, and event staffing from Project S7.",
  alternates: { canonical: "/services" },
};

async function getServices(): Promise<PublicService[]> {
  const approved = approvedServices.map((s) => ({
    title: s.title,
    slug: s.slug,
    description: s.description,
    features: s.features,
    image: resolveServiceImage(s.slug),
  }));

  try {
    const res = await fetch(`${siteConfig.apiUrl}/services`, { next: { revalidate: 0 } });
    const json = await res.json();
    if (json.data?.length) {
      const filtered = filterApprovedServices(json.data as PublicService[]);
      if (filtered.length) {
        return applyServiceStockImages(
          filtered.map((api) => {
            const brief = approvedServices.find((s) => s.slug === api.slug);
            return {
              ...api,
              description: brief?.description || api.description,
              features: brief?.features || api.features,
            };
          })
        );
      }
    }
  } catch {
    /* fallback */
  }

  return applyServiceStockImages(approved);
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Events, exhibitions & stands — delivered end to end"
        description="Five core disciplines. One accountable partner. From exhibition halls to bespoke stands, project leadership, and professional event teams."
        image={images.expo}
      />

      <section className="section-pad bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="What we deliver"
            title="Precision services for landmark live experiences"
            description="Engage Project S7 for a single discipline or a full turnkey programme — every service shares the same premium standard."
          />
          <div className="mt-16 space-y-24">
            {services.map((s, i) => {
              const brief = approvedServices.find((b) => b.slug === s.slug);
              if (!isApprovedServiceSlug(s.slug)) return null;

              return (
                <FadeUp key={s.slug}>
                  <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div
                      className={`relative aspect-[16/11] overflow-hidden image-zoom ${i % 2 ? "lg:order-2" : ""}`}
                    >
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
                      <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{s.description}</p>
                      {brief?.features && (
                        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                          {brief.features.slice(0, 6).map((f) => (
                            <li key={f} className="text-sm text-muted">
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/services/${s.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pink transition hover:text-pink-soft"
                        >
                          View service <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        {brief?.cta && (
                          <Link
                            href={brief.cta.href}
                            className={`inline-flex rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                              brief.cta.prominent
                                ? "bg-pink text-white hover:bg-pink-soft"
                                : "border border-pink text-pink hover:bg-pink hover:text-white"
                            }`}
                          >
                            {brief.cta.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
