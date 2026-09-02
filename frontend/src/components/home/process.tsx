"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/motion";
import { processStages } from "@/lib/brief-content";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!inView || !autoPlay) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % processStages.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [inView, autoPlay]);

  const go = (dir: -1 | 1) => {
    setAutoPlay(false);
    setActive((i) => (i + dir + processStages.length) % processStages.length);
  };

  return (
    <section ref={sectionRef} id="process" className="section-pad relative overflow-hidden bg-soft">
      <div className="container-premium relative">
        <SectionHeading
          eyebrow="Our Process"
          title="From consultation to success"
          description="Consultation → Strategy → Design → Planning → Build → Delivery → Success"
        />

        <div className="relative mt-16 md:mt-20">
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-line xl:block" />
          <motion.div
            className="pointer-events-none absolute left-0 top-5 hidden h-px origin-left bg-pink xl:block"
            style={{ width: "100%" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: active / Math.max(processStages.length - 1, 1) } : { scaleX: 0 }}
            transition={{ duration: 0.55, ease }}
          />

          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 xl:gap-4">
            {processStages.map((step, i) => {
              const isActive = i === active;
              const isPast = i <= active;

              return (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.1 + i * 0.06, ease }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPlay(false);
                      setActive(i);
                    }}
                    className="group w-full text-left"
                    aria-current={isActive ? "step" : undefined}
                  >
                    <div className="relative mb-5 flex items-center">
                      <span
                        className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center text-xs font-semibold tracking-wider transition-colors duration-300",
                          isPast ? "bg-pink text-white" : "border border-pink/40 bg-white text-pink"
                        )}
                      >
                        {step.step}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        "font-display text-xl tracking-tight transition-colors md:text-2xl",
                        isActive ? "text-pink" : "text-ink group-hover:text-pink"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className={cn("mt-2 text-sm leading-relaxed", isActive ? "text-ink/80" : "text-muted")}>
                      {step.text}
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-line bg-white text-ink transition hover:border-pink hover:text-pink"
                aria-label="Previous process stage"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-line bg-white text-ink transition hover:border-pink hover:text-pink"
                aria-label="Next process stage"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden flex-wrap gap-2 sm:flex" role="tablist" aria-label="Process stages">
              {processStages.map((step, i) => (
                <button
                  key={step.step}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => {
                    setAutoPlay(false);
                    setActive(i);
                  }}
                  className={cn(
                    "h-1.5 transition-all duration-500",
                    i === active ? "w-8 bg-pink" : "w-2.5 bg-line hover:bg-pink/40"
                  )}
                  aria-label={`Go to ${step.title}`}
                />
              ))}
            </div>

            <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-muted lg:block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  {processStages[active].title}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
