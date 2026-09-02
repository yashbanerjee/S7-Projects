import { Hero } from "@/components/home/hero";
import { AboutTeaser } from "@/components/home/about-teaser";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { WhyChooseUs } from "@/components/home/why-choose";
import { Process } from "@/components/home/process";
import { CtaBand } from "@/components/home/cta-band";
import { siteConfig } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.seoTitle,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <AboutTeaser />
      <ServicesShowcase />
      <WhyChooseUs />
      <Process />
      <CtaBand />
    </>
  );
}
