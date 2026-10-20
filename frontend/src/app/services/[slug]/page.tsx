import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import {
  approvedServices,
  APPROVED_SERVICE_SLUGS,
  isApprovedServiceSlug,
} from "@/lib/brief-content";
import { resolveServiceImage, resolveServiceGallery } from "@/lib/content";
import { siteConfig } from "@/lib/brand";
import { Check } from "lucide-react";

type ServiceDetail = {
  title: string;
  slug: string;
  description: string;
  image: string;
  features: string[];
  cta: { label: string; href: string; prominent?: boolean };
  gallery: string[];
};

async function getService(slug: string): Promise<ServiceDetail | null> {
  if (!isApprovedServiceSlug(slug)) return null;

  const brief = approvedServices.find((s) => s.slug === slug)!;
  let apiDescription = brief.description;

  try {
    const res = await fetch(`${siteConfig.apiUrl}/services/${slug}`, { next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data?.description) apiDescription = json.data.description;
    }
  } catch {
    /* brief fallback */
  }

  const image = resolveServiceImage(slug);
  const gallery = resolveServiceGallery(slug, image);

  return {
    title: brief.title,
    slug,
    description: brief.description || apiDescription,
    image,
    features: brief.features,
    cta: brief.cta,
    gallery,
  };
}

export async function generateStaticParams() {
  return APPROVED_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} description={service.description} image={service.image} />

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Overview" title="What we deliver" />
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted">
            <FadeUp>
              <p>{service.description}</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <Link
                href={service.cta.href}
                className={`mt-4 inline-flex rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider transition ${
                  service.cta.prominent
                    ? "bg-pink text-white hover:bg-pink-soft"
                    : "border border-pink text-pink hover:bg-pink hover:text-white"
                }`}
              >
                {service.cta.label}
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {service.gallery.length > 0 && (
        <section className="section-pad bg-soft">
          <div className="container-premium">
            <SectionHeading eyebrow="Visual atmosphere" title="Premium event environments" />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {service.gallery.map((src, i) => (
                <FadeUp key={`${src}-${i}`} delay={i * 0.06}>
                  <div className="relative aspect-[4/5] overflow-hidden image-zoom">
                    <Image
                      src={src}
                      alt={`${service.title} visual ${i + 1}`}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Services include"
              title="Scope & capability"
            />
            <ul className="mt-10 space-y-4">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-muted">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end">
            <div className="relative aspect-[16/11] overflow-hidden image-zoom">
              <Image src={service.image} alt="" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={service.cta.href}
                className="inline-flex rounded-full bg-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pink-soft"
              >
                {service.cta.label}
              </Link>
              <Link
                href="/quote"
                className="inline-flex rounded-full border border-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-pink transition hover:bg-pink hover:text-white"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
