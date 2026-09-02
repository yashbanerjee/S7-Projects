"use client";

import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { whyChooseContent } from "@/lib/brief-content";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} className="section-pad relative overflow-hidden bg-white">
      <div className="container-premium">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow={whyChooseContent.eyebrow}
              title={whyChooseContent.title}
              description={whyChooseContent.description}
            />
          </div>

          <div className="lg:col-span-7">
            <p className="font-display text-2xl leading-snug tracking-tight text-ink md:text-3xl">
              Why clients choose us
            </p>
            <ol className="mt-10 space-y-0 divide-y divide-line/80 border-y border-line/80">
              {whyChooseContent.reasons.map((reason, i) => (
                <motion.li
                  key={reason}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-6 py-5 md:py-6"
                >
                  <span className="font-display text-sm tabular-nums text-pink md:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg tracking-tight text-ink md:text-xl">{reason}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <FadeUp delay={0.2}>
          <p className="mt-16 max-w-3xl border-l-2 border-pink pl-6 text-lg leading-relaxed text-muted md:text-xl">
            Capability, reliability, and premium execution — across events, exhibitions, stands and project
            management.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
