import { Hero } from "@/components/home/hero";
import { AboutTeaser } from "@/components/home/about-teaser";
import { EventMoments } from "@/components/home/event-moments";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { WhyChooseUs } from "@/components/home/why-choose";
import { PortfolioPreview } from "@/components/home/portfolio-preview";
import { Process } from "@/components/home/process";
import { Testimonials } from "@/components/home/testimonials";
import { IndustriesGrid } from "@/components/home/industries";
import { FaqPreview } from "@/components/home/faq-preview";
import { CtaBand } from "@/components/home/cta-band";
import {
  fallbackServices,
  fallbackPortfolio,
  fallbackTestimonials,
  fallbackFaqs,
  fallbackIndustries,
  applyServiceStockImages,
} from "@/lib/content";
import { siteConfig } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

async function getData() {
  try {
    const base = siteConfig.apiUrl;
    const [services, portfolio, testimonials, faqs, industries] = await Promise.all([
      fetch(`${base}/services`, { next: { revalidate: 60 } }).then((r) => r.json()),
      fetch(`${base}/portfolio?featured=true`, { next: { revalidate: 60 } }).then((r) => r.json()),
      fetch(`${base}/content/testimonials`, { next: { revalidate: 60 } }).then((r) => r.json()),
      fetch(`${base}/content/faqs`, { next: { revalidate: 60 } }).then((r) => r.json()),
      fetch(`${base}/content/industries`, { next: { revalidate: 60 } }).then((r) => r.json()),
    ]);
    return {
      services: applyServiceStockImages(services.data?.length ? services.data : fallbackServices),
      portfolio: portfolio.data?.length ? portfolio.data : fallbackPortfolio,
      testimonials: testimonials.data?.length ? testimonials.data : fallbackTestimonials,
      faqs: faqs.data?.length ? faqs.data : fallbackFaqs,
      industries: industries.data?.length ? industries.data : fallbackIndustries,
    };
  } catch {
    return {
      services: applyServiceStockImages(fallbackServices),
      portfolio: fallbackPortfolio,
      testimonials: fallbackTestimonials,
      faqs: fallbackFaqs,
      industries: fallbackIndustries,
    };
  }
}

export default async function HomePage() {
  const data = await getData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
    },
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <AboutTeaser />
      <EventMoments />
      <ServicesShowcase services={data.services} />
      <WhyChooseUs />
      <PortfolioPreview items={data.portfolio} />
      <Process />
      <Testimonials items={data.testimonials} />
      <IndustriesGrid items={data.industries} />
      <FaqPreview items={data.faqs} />
      <CtaBand />
    </>
  );
}
