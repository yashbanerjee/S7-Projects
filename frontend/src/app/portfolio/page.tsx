import type { Metadata } from "next";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { portfolioPlaceholder } from "@/lib/brief-content";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: portfolioPlaceholder.description,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={portfolioPlaceholder.title}
        description={portfolioPlaceholder.description}
        image={images.expo}
      />
      <PortfolioClient items={[]} />
      <CtaBand />
    </>
  );
}
