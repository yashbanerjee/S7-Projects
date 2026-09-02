import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { QuoteForm } from "@/components/quote/quote-form";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a quote from Project S7 for exhibition management, stand design, stand build, project management, and event staffing.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const isDesign = intent === "design";

  return (
    <>
      <PageHero
        eyebrow={isDesign ? "Design enquiry" : "Enquiry"}
        title={isDesign ? "Start Designing" : "Get a Quote"}
        description={
          isDesign
            ? "Share your exhibition stand vision — our creative team will respond with concept direction and next steps."
            : "Tell us about your event, exhibition or stand project — we respond with clarity and a structured proposal."
        }
        image={isDesign ? images.booth : images.lighting}
      />
      <QuoteForm intent={isDesign ? "design" : "quote"} />
    </>
  );
}
