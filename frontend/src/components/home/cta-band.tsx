import { ParallaxImage } from "@/components/ui/media";
import { FadeUp } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/content";

export function CtaBand() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <ParallaxImage
        src={images.cta}
        alt="Stage lighting at a premium corporate production"
        className="absolute inset-0 h-full w-full"
        overlay="hero"
      />
      <div className="relative z-10 flex min-h-[70vh] items-center">
        <div className="container-premium py-24">
          <FadeUp>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Begin the conversation
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="font-display max-w-4xl text-4xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Let’s craft your next landmark experience
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
              Share your vision, dates, and markets. Our directors will respond with clarity, creative direction, and a practical path forward.
            </p>
          </FadeUp>
          <FadeUp delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/quote" variant="white" size="lg">
                Get a Quote
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:border-white hover:bg-white hover:text-ink"
              >
                Contact Us
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
