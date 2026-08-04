"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 36,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow && (
        <FadeUp>
          <p
            className={cn(
              "mb-4 text-xs font-semibold uppercase tracking-[0.28em]",
              light ? "text-white/70" : "text-pink"
            )}
          >
            {eyebrow}
          </p>
        </FadeUp>
      )}
      <FadeUp delay={0.08}>
        <h2
          className={cn(
            "font-display text-balance text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl",
            light ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
      </FadeUp>
      {description && (
        <FadeUp delay={0.14}>
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed md:text-lg",
              light ? "text-white/75" : "text-muted",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </FadeUp>
      )}
    </div>
  );
}
