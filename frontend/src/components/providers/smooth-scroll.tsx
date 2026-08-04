"use client";

import { useEffect } from "react";

/** Client-only Lenis init — renders nothing, never wraps page content. */
export function SmoothScroll() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        let raf = 0;
        const frame = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        cleanup = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
