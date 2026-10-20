import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import { approvedServices, isApprovedServiceSlug } from "@/lib/brief-content";
import { images, resolveServiceImage } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Expertise",
  description:
    "Exhibition management, exhibition stand design and build, project management and consultancy, and speaker and VIP services from Project S7.",
  alternates: { canonical: "/services" },
};

function getServices() {
  return approvedServices.map((s) => ({
    title: s.title,
    slug: s.slug,
    description: s.description,
    features: [...s.features],
    image: resolveServiceImage(s.slug),
  }));
}

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      <PageHero
        eyebrow="Our Expertise"
        title="We bring ambitious projects to life."
        description="Five core disciplines. One accountable partner. From exhibition halls and bespoke stands to project leadership and speaker coordination."
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
                      <h2 className="font-display text-3xl tracking-tight md:text-5xl">{s.title}</h2>
                      <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{s.description}</p>
                      {brief?.features && (
                        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                          {brief.features.map((f) => (
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
