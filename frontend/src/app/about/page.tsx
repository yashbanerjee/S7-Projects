import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import { aboutPageContent } from "@/lib/brief-content";
import { images } from "@/lib/content";
import Link from "next/link";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: aboutPageContent.positioning,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={aboutPageContent.eyebrow}
        title={aboutPageContent.title}
        description={aboutPageContent.copy[0]}
        image={images.about}
      />

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Partner" title="Creative authority & operational capability" />
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted">
            {aboutPageContent.copy.map((p, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <p>{p}</p>
              </FadeUp>
            ))}
            <FadeUp delay={0.14}>
              <Link
                href={aboutPageContent.cta.href}
                className="mt-4 inline-flex rounded-full bg-pink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pink-soft"
              >
                {aboutPageContent.cta.label}
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-premium grid gap-10 lg:grid-cols-2">
          <FadeUp>
            <div className="relative aspect-[16/11] overflow-hidden image-zoom">
              <Image
                src={images.expo}
                alt="Large-scale premium exhibition environment"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="relative aspect-[16/11] overflow-hidden image-zoom">
              <Image
                src={images.stage}
                alt="Event production and premium staging"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
