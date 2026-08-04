import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { QuoteForm } from "@/components/quote/quote-form";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a Project S7 quote for exhibition management, stand design & build, event production, and full programme delivery.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Quote Request"
        title="Tell us about your programme"
        description="Share the essentials — we respond with a structured proposal, creative direction, and a practical delivery plan."
        image={images.lighting}
      />
      <QuoteForm />
    </>
  );
}
