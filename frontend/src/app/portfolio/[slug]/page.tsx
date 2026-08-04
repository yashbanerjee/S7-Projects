import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackPortfolio } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

async function getItem(slug: string) {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/portfolio/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    /* fallback */
  }
  return fallbackPortfolio.find((p) => p.slug === slug) || null;
}

export async function generateStaticParams() {
  return fallbackPortfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Project" };
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();

  const gallery = item.gallery?.length
    ? item.gallery
    : [item.coverImage, item.coverImage, item.coverImage];

  return (
    <>
      <PageHero
        eyebrow={item.category}
        title={item.title}
        description={`${item.client || "Confidential Client"} · ${item.location || ""} · ${item.year || ""}`}
        image={item.coverImage}
      />

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Client</p>
              <p className="mt-1 font-medium">{item.client || "Confidential"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Location</p>
              <p className="mt-1 font-medium">{item.location || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Year</p>
              <p className="mt-1 font-medium">{item.year || "—"}</p>
            </div>
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((t: string) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-8">
            <SectionHeading title="Case study" />
            <FadeUp>
              <p className="mt-6 text-lg leading-relaxed text-muted">{item.description}</p>
            </FadeUp>
            {item.content && (
              <FadeUp delay={0.08}>
                <p className="mt-6 text-lg leading-relaxed text-muted">{item.content}</p>
              </FadeUp>
            )}
            <FadeUp delay={0.12}>
              <div className="mt-10">
                <Button href="/quote">Start a similar project</Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-soft section-pad">
        <div className="container-premium grid gap-4 md:grid-cols-3">
          {gallery.map((src: string, i: number) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="relative aspect-[4/5] overflow-hidden image-zoom">
                <Image src={src} alt={`${item.title} ${i + 1}`} fill sizes="33vw" className="object-cover" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
