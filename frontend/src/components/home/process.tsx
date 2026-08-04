"use client";

import { useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/motion";
import { processSteps } from "@/lib/content";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-20% 0px" });
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!inView || !autoPlay) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % processSteps.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [inView, autoPlay]);

  const go = (dir: -1 | 1) => {
    setAutoPlay(false);
    setActive((i) => (i + dir + processSteps.length) % processSteps.length);
  };

  return (
    <section ref={sectionRef} className="section-pad relative overflow-hidden bg-white">
      {/* Soft atmospheric motion in background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-pink-muted/60 blur-3xl"
        animate={
          inView
            ? { x: [0, 40, 0], y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }
            : { opacity: 0 }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-pink/5 blur-3xl"
        animate={
          inView
            ? { x: [0, -30, 0], y: [0, -16, 0], opacity: [0.3, 0.55, 0.3] }
            : { opacity: 0 }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container-premium relative">
        <SectionHeading
          eyebrow="Our Process"
          title="A clear path from ambition to live moment"
          description="Five deliberate phases that keep creative ambition and delivery discipline in balance."
        />

        {/* Desktop / tablet timeline */}
        <div className="relative mt-16 md:mt-20">
          {/* Track */}
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-line lg:block" />
          <motion.div
            className="pointer-events-none absolute left-0 top-5 hidden h-px origin-left bg-pink lg:block"
            style={{ width: "100%" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.25 }}
          />

          {/* Progress highlight fill along steps */}
          <motion.div
            className="pointer-events-none absolute left-0 top-5 hidden h-0.5 origin-left bg-pink lg:block"
            initial={{ scaleX: 0 }}
            animate={
              inView
                ? { scaleX: active / Math.max(processSteps.length - 1, 1) }
                : { scaleX: 0 }
            }
            transition={{ duration: 0.55, ease }}
            style={{ width: "100%" }}
          />

          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {processSteps.map((step, i) => {
              const isActive = i === active;
              const isPast = i <= active;

              return (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.75, delay: 0.15 + i * 0.12, ease }}
                  className="relative"
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
                    <div className="relative mb-6 flex items-center lg:justify-start">
                      <motion.span
                        className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold tracking-wider transition-colors duration-300",
                          isPast
                            ? "bg-pink text-white shadow-lg shadow-pink/25"
                            : "border border-pink/40 bg-white text-pink"
                        )}
                        animate={
                          isActive
                            ? { scale: [1, 1.12, 1], boxShadow: "0 10px 30px rgba(196,32,94,0.28)" }
                            : { scale: 1 }
                        }
                        transition={
                          isActive
                            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.35 }
                        }
                      >
                        {step.step}
                      </motion.span>

                      {/* Pulse ring on active */}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          className="absolute left-0 top-0 h-10 w-10 rounded-full border-2 border-pink"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.55, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                    </div>

                    <h3
                      className={cn(
                        "font-display text-2xl tracking-tight transition-colors duration-300",
                        isActive ? "text-pink" : "text-ink group-hover:text-pink"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed transition-opacity duration-300 md:text-base",
                        isActive ? "text-ink/80" : "text-muted"
                      )}
                    >
                      {step.text}
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </ol>

          {/* Controls + progress dots */}
          <div className="mt-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-pink hover:text-pink"
                aria-label="Previous process step"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-pink hover:text-pink"
                aria-label="Next process step"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2" role="tablist" aria-label="Process steps">
              {processSteps.map((step, i) => (
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
                    "h-1.5 rounded-full transition-all duration-500",
                    i === active ? "w-8 bg-pink" : "w-2.5 bg-line hover:bg-pink/40"
                  )}
                  aria-label={`Go to ${step.title}`}
                />
              ))}
            </div>

            <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-muted sm:block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  Phase {processSteps[active].step} · {processSteps[active].title}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
