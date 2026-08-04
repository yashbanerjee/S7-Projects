import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { whyUs } from "@/lib/content";
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
    <section className="section-pad bg-white">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Quiet confidence. Visible results."
          description="What distinguishes Project S7 is not volume of claims — it is the standard of care applied to every square metre, every cue, every guest interaction."
          align="center"
        />

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
      </div>
    </section>
  );
}
