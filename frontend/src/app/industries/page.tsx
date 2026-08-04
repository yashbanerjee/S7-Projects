import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackIndustries, images } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Project S7 industries: government, corporate, international, healthcare, education, technology, automotive, and retail exhibition experiences.",
  alternates: { canonical: "/industries" },
};

async function getIndustries() {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/content/industries`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    return json.data?.length ? json.data : fallbackIndustries;
  } catch {
    return fallbackIndustries;
  }
}

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sector fluency. Experience excellence."
        description="We adapt spatial design, protocol, hospitality, and operational systems to the culture of each industry we serve."
        image={images.architecture}
      />

      <section className="section-pad bg-white">
        <div className="container-premium space-y-24">
          {industries.map((item: (typeof fallbackIndustries)[number], i: number) => (
            <article key={item.slug} id={item.slug} className="scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <FadeUp className={i % 2 ? "lg:order-2" : ""}>
                <div className="relative aspect-[16/11] overflow-hidden image-zoom">
                  <Image src={item.image} alt={item.title} fill sizes="50vw" className="object-cover" />
                </div>
              </FadeUp>
              <FadeUp delay={0.1} className={i % 2 ? "lg:order-1" : ""}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">
                  Industry 0{i + 1}
                </p>
                <h2 className="font-display mt-4 text-3xl tracking-tight md:text-5xl">{item.title}</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">{item.description}</p>
              </FadeUp>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
