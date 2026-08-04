import Image from "next/image";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { whyUs, images } from "@/lib/content";
import {
  Layers,
  Gem,
  Globe2,
  Shield,
  LineChart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Layers,
  Gem,
  Globe2,
  Shield,
  LineChart,
  Sparkles,
};

export function WhyChooseUs() {
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="container-premium">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Quiet confidence. Visible results."
              description="What distinguishes Project S7 is not volume of claims — it is the standard of care applied to every square metre, every cue, every guest interaction."
            />
          </div>
          <FadeUp className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden image-zoom">
              <Image
                src={images.stage}
                alt="Live stage production delivered by Project S7"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <p className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Live showcraft
              </p>
            </div>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => {
            const Icon = icons[item.icon] || Sparkles;
            return (
              <FadeUp key={item.title} delay={i * 0.06}>
                <div className="group">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line transition group-hover:border-pink group-hover:bg-pink-muted">
                    <Icon className="h-5 w-5 text-pink" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl tracking-tight">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">{item.text}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Image strip of craft details */}
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { src: images.booth, label: "Stand craft" },
            { src: images.gala, label: "Hospitality" },
            { src: images.hero, label: "Keynotes" },
            { src: images.lightsCrowd, label: "Atmosphere" },
          ].map((shot, i) => (
            <FadeUp key={shot.label} delay={i * 0.05}>
              <div className="group relative aspect-[4/5] overflow-hidden image-zoom">
                <Image
                  src={shot.src}
                  alt={shot.label}
                  fill
                  sizes="25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {shot.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
