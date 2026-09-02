import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactClient } from "@/components/contact/contact-client";
import { images } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Project S7 for events, exhibitions, exhibition stands and project management enquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const isConsultation = intent === "consultation";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={isConsultation ? "Request a Consultation" : "Get in touch"}
        description={
          isConsultation
            ? "Not sure where to start? Share your objectives and our team will guide you through the right approach."
            : "Whether you need a quote, design discussion, or strategic advice — our team is ready to respond with clarity."
        }
        image={images.contact}
      />
      <ContactClient
        email={siteConfig.email}
        phone={siteConfig.phone}
        whatsapp={siteConfig.whatsapp}
        address={siteConfig.address}
        social={siteConfig.social}
        intent={isConsultation ? "consultation" : "general"}
      />
    </>
  );
}
