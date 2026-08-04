import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section className="section-pad bg-white">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Process"
          title="A clear path from ambition to live moment"
          description="Five deliberate phases that keep creative ambition and delivery discipline in balance."
        />

        <div className="relative mt-20">
          <div className="absolute left-0 top-4 hidden h-px w-full bg-line lg:block" />
          <ol className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.07}>
                <li className="relative">
                  <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-full border border-pink bg-white text-xs font-semibold text-pink">
                    {step.step}
                  </div>
                  <h3 className="font-display text-2xl tracking-tight">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{step.text}</p>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
