"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { eventMoments } from "@/lib/content";

export function EventMoments() {
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(railRef, { once: true, margin: "-8% 0px" });

  return (
    <section className="overflow-hidden bg-ink py-20 md:py-28">
      <div className="container-premium">
        <SectionHeading
          light
          eyebrow="Live moments"
          title="Environments built for attention"
          description="Exhibitions, stages, receptions, and brand worlds captured at their most compelling — the craft Project S7 designs into every programme."
        />
      </div>

      {/* Primary mosaic */}
      <div className="container-premium mt-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
          {eventMoments.slice(0, 5).map((shot, i) => {
            const large = i === 0;
            return (
              <FadeUp
                key={shot.label}
                delay={i * 0.06}
                className={
                  large
                    ? "sm:col-span-2 sm:row-span-2"
                    : ""
                }
              >
                <figure
                  className={`group relative overflow-hidden ${
                    large ? "aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[420px]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-90 transition group-hover:from-ink/85" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      0{i + 1}
                    </p>
                    <p className="font-display mt-1 text-lg tracking-tight text-white md:text-xl">
                      {shot.label}
                    </p>
                  </figcaption>
                </figure>
              </FadeUp>
            );
          })}
        </div>
      </div>

      {/* Slow infinite strip of event stills */}
      <div ref={railRef} className="mt-10 md:mt-14">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex w-max gap-3 md:gap-4"
            animate={inView ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={{ duration: 42, ease: "linear", repeat: Infinity }}
          >
            {[...eventMoments, ...eventMoments].map((shot, i) => (
              <div
                key={`${shot.label}-${i}`}
                className="relative h-40 w-64 shrink-0 overflow-hidden md:h-52 md:w-80"
              >
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
