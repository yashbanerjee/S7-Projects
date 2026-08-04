import type { Metadata } from "next";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackPortfolio, images } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Project S7 portfolio — exhibitions, corporate events, booths, and case studies spanning government, technology, automotive, healthcare, and more.",
  alternates: { canonical: "/portfolio" },
};

async function getPortfolio() {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/portfolio`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data?.length ? json.data : fallbackPortfolio;
  } catch {
    return fallbackPortfolio;
  }
}

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work that commands attention"
        description="A curated selection of exhibition and event environments — designed, produced, and delivered with Project S7 standards."
        image={images.heroAlt}
      />
      <PortfolioClient items={items} />
      <CtaBand />
    </>
  );
}
