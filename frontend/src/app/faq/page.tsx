import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { FaqClient } from "@/components/faq/faq-client";
import { CtaBand } from "@/components/home/cta-band";
import { fallbackFaqs, images } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Project S7 exhibition management, process, international delivery, budgets, and sustainability.",
  alternates: { canonical: "/faq" },
};

async function getFaqs() {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/content/faqs`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    return json.data?.length ? json.data : fallbackFaqs;
  } catch {
    return fallbackFaqs;
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Clarity before commitment"
        description="Answers to the questions organisations ask as they evaluate a premium exhibitions and events partner."
        image={images.process}
      />
      <FaqClient faqs={faqs} />
      <CtaBand />
    </>
  );
}
