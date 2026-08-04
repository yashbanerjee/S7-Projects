import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CareersClient } from "@/components/careers/careers-client";
import { images, fallbackJobs } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Project S7 — roles across exhibition design, project management, and live production. Culture, benefits, and applications.",
  alternates: { canonical: "/careers" },
};

async function getJobs() {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/jobs`, { next: { revalidate: 30 } });
    const json = await res.json();
    return json.data?.length ? json.data : fallbackJobs;
  } catch {
    return fallbackJobs;
  }
}

const benefits = [
  "High-profile international programmes",
  "Collaborative studio culture",
  "Professional development pathways",
  "Competitive compensation packages",
  "Travel and market exposure",
  "Respect for craft and craftspeople",
];

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build landmark experiences with us"
        description="Project S7 is a home for designers, producers, and project leaders who care about details as much as outcomes."
        image={images.careers}
      />

      <section className="section-pad bg-white">
        <div className="container-premium grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Culture"
              title="Calm intensity. Shared standards."
              description="We work seriously without unnecessary drama. Senior practitioners mentor rising talent, and every role has a clear contribution to the live moment."
            />
          </div>
          <FadeUp>
            <div className="relative aspect-[16/11] overflow-hidden image-zoom">
              <Image src={images.culture} alt="Project S7 team collaboration" fill sizes="50vw" className="object-cover" />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-premium">
          <SectionHeading eyebrow="Benefits" title="What we offer" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <FadeUp key={b} delay={i * 0.05}>
                <div className="border-t border-pink pt-5">
                  <p className="text-lg text-ink">{b}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CareersClient jobs={jobs} />
    </>
  );
}
