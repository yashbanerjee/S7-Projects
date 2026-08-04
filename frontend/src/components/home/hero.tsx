import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/motion";
import { ParallaxImage } from "@/components/ui/media";
import { images } from "@/lib/content";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      <ParallaxImage
        src={images.hero}
        alt="Luxury corporate exhibition with cinematic lighting"
        className="absolute inset-0 h-full w-full"
        priority
        overlay="hero"
        sizes="100vw"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-36 md:pb-24 md:pt-40">
        <div className="container-premium">
          <FadeUp>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Project S7 · Events & Exhibitions
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display max-w-5xl text-balance text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Experiences that elevate brands
            </h1>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Exhibition management, stand architecture, and event production for organisations that expect luxury craftsmanship and flawless delivery.
            </p>
          </FadeUp>
          <FadeUp delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/quote" variant="white" size="lg">
                Get a Quote
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="border-white/30 text-white hover:border-white hover:bg-white hover:text-ink">
                Request Consultation
              </Button>
            </div>
          </FadeUp>
        </div>

        <div className="container-premium mt-16 flex items-center justify-between border-t border-white/15 pt-6 text-white/60">
          <p className="text-xs uppercase tracking-[0.25em]">Scroll to explore</p>
          <ArrowDownRight className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
}
