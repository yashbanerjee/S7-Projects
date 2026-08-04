import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" image={images.architecture} />
      <section className="section-pad bg-white">
        <div className="container-premium max-w-3xl space-y-6 text-muted leading-relaxed">
          <p>
            Project S7 collects personal information you submit through forms (name, email, phone, company, and message content) solely to respond to enquiries, provide quotes, and administer career applications.
          </p>
          <p>
            File uploads are stored securely and used only for the purpose stated at collection. We do not sell personal data. Access is limited to authorised administrative personnel.
          </p>
          <p>
            Email notifications may be sent via our SMTP provider. Analytics may process aggregated traffic data. You may request access or deletion of your personal data by writing to hello@projects7.com.
          </p>
          <p>This policy may be updated periodically. Continued use of the site constitutes acceptance of the then-current policy.</p>
        </div>
      </section>
    </>
  );
}
