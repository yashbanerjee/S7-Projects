import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" image={images.contact} />
      <section className="section-pad bg-white">
        <div className="container-premium max-w-3xl space-y-6 text-muted leading-relaxed">
          <p>
            This website is operated by Project S7. Content is provided for general information and illustration. Images may represent completed programmes or curated atmospheres and are not guarantees of identical future deliverables.
          </p>
          <p>
            Quotes and proposals are subject to formal written agreements. Intellectual property on this site — including branding, copy, and photography where owned by Project S7 — may not be reused without written permission.
          </p>
          <p>
            To the fullest extent permitted by law, Project S7 is not liable for indirect or consequential damages arising from use of this website. External links are provided for convenience and are not under our control.
          </p>
        </div>
      </section>
    </>
  );
}
