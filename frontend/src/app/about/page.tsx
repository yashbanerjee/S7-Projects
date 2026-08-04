import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { CtaBand } from "@/components/home/cta-band";
import { aboutContent, images } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover Project S7 — our story, mission, vision, values, leadership approach, and timeline as a luxury corporate events and exhibition company.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Crafted for brands that demand more from the live stage"
        description="Project S7 unites spatial design, production discipline, and hospitality intelligence for organisations that treat every exhibition as a strategic asset."
        image={images.aboutWide}
      />

      <section className="section-pad bg-white">
        <div className="container-premium grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our Story" title="From specialised studio to full-spectrum partner" />
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted">
            <FadeUp>
              <p>{aboutContent.story}</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <p>{aboutContent.storyContinued}</p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-soft section-pad">
        <div className="container-premium grid gap-12 md:grid-cols-2">
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">Mission</p>
            <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
              {aboutContent.mission}
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">Vision</p>
            <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
              {aboutContent.vision}
            </h2>
          </FadeUp>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-premium">
          <SectionHeading eyebrow="Values" title="Principles that shape every programme" />
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {aboutContent.values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.06}>
                <div className="border-t border-pink pt-6">
                  <h3 className="font-display text-2xl tracking-tight">{v.title}</h3>
                  <p className="mt-4 text-muted leading-relaxed">{v.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-premium">
          <SectionHeading eyebrow="Leadership" title="Practice-led direction" description="Senior practitioners across creative, delivery, and production — not detached layers of management." />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {aboutContent.leadership.map((person, i) => (
              <FadeUp key={person.name} delay={i * 0.08}>
                <div className="relative aspect-[4/5] overflow-hidden image-zoom mb-6">
                  <Image src={person.image} alt={person.name} fill sizes="33vw" className="object-cover" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink">{person.role}</p>
                <h3 className="font-display mt-2 text-2xl">{person.name}</h3>
                <p className="mt-3 text-muted leading-relaxed">{person.text}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-premium">
          <SectionHeading eyebrow="Timeline" title="Milestones along our path" />
          <ol className="mt-16 space-y-10 border-l border-line pl-8 md:pl-12">
            {aboutContent.timeline.map((item, i) => (
              <FadeUp key={item.year} delay={i * 0.05}>
                <li className="relative">
                  <span className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full bg-pink md:-left-[3.55rem]" />
                  <p className="text-sm font-semibold text-pink">{item.year}</p>
                  <h3 className="font-display mt-2 text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-muted">{item.text}</p>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
