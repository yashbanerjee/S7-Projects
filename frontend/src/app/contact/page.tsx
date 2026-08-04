import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactClient } from "@/components/contact/contact-client";
import { images } from "@/lib/content";
import { siteConfig } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Project S7 — email, WhatsApp, phone, Google Map, and consultation form for luxury events and exhibitions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s discuss your next programme"
        description="Whether you are planning a national pavilion or a single signature stand, our team is ready to respond with clarity."
        image={images.contact}
      />
      <ContactClient
        email={siteConfig.email}
        phone={siteConfig.phone}
        whatsapp={siteConfig.whatsapp}
        address={siteConfig.address}
        social={siteConfig.social}
      />
    </>
  );
}
