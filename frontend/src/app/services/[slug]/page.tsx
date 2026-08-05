import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackServices, resolveServiceImage } from "@/lib/content";
import { siteConfig } from "@/lib/brand";
import { Check } from "lucide-react";

type Service = (typeof fallbackServices)[number] & {
  overview?: string;
  gallery?: string[];
  process?: { step: string; title: string; text: string }[];
  benefits?: string[];
  features?: string[];
};

async function getService(slug: string): Promise<Service | null> {
  let service: Service | null = null;
  try {
    const res = await fetch(`${siteConfig.apiUrl}/services/${slug}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) service = json.data;
    }
  } catch {
    /* fallback */
  }
  if (!service) {
    service = fallbackServices.find((s) => s.slug === slug) || null;
  }
  if (!service) return null;

  const image = resolveServiceImage(service.slug, service.image);
  // Keep custom uploads; replace stock/CDN gallery frames so stale API photos never stick.
  const galleryRaw = service.gallery?.length ? service.gallery : [image, image, image];
  const gallery = galleryRaw.map((g) => {
    if (!g || /pexels\.com|unsplash\.com/i.test(g)) return image;
    return g;
  });

  return { ...service, image, gallery };
}

export async function generateStaticParams() {
  return fallbackServices.map((s) => ({ slug: s.slug }));
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

  const process = service.process || [
    { step: "01", title: "Discover", text: "Align on goals, audiences, and constraints." },
    { step: "02", title: "Design", text: "Define creative and operational approach." },
    { step: "03", title: "Deliver", text: "Execute with precision and live support." },
    { step: "04", title: "Define", text: "Report, capture, and plan onward." },
  ];
  const benefits = service.benefits || [
    "Dedicated project leadership",
    "Brand-safe craft standards",
    "Transparent commercial practice",
    "International delivery capability",
  ];
  const gallery = service.gallery || [service.image, service.image, service.image];

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.tagline || service.description}
        image={service.image}
      />

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Overview" title="How we approach this discipline" />
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted">
            <FadeUp>
              <p>{service.overview || service.description}</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <p>{service.description}</p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-soft section-pad">
        <div className="container-premium">
          <SectionHeading eyebrow="Gallery" title="Visual atmosphere" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {gallery.slice(0, 3).map((src, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="relative aspect-[4/5] overflow-hidden image-zoom">
                  <Image src={src} alt={`${service.title} gallery ${i + 1}`} fill sizes="33vw" className="object-cover" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-premium">
          <SectionHeading eyebrow="Process" title="Delivery pathway" />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.06}>
                <li>
                  <p className="text-sm font-semibold text-pink">{step.step}</p>
                  <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
                  <p className="mt-3 text-muted leading-relaxed">{step.text}</p>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-premium grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Benefits" title="What clients gain" />
            <ul className="mt-10 space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-muted">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image src={service.image} alt="" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="mt-8">
              <Button href="/quote" size="lg">
                Request this service
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
