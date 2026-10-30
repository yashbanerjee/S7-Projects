import { ParallaxImage } from "@/components/ui/media";
import { FadeUp } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/content";
import { ctaBandContent } from "@/lib/brief-content";

export function CtaBand() {
  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-ink">
      <ParallaxImage
        src={images.cta}
        alt="Premium event production with dramatic stage lighting"
        className="absolute inset-0 h-full w-full"
        overlay="hero"
      />
      <div className="relative z-10 flex min-h-[60vh] items-center">
        <div className="container-premium py-24">
          <FadeUp>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
              {ctaBandContent.eyebrow}
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="font-display max-w-4xl text-4xl leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              {ctaBandContent.title}
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">{ctaBandContent.description}</p>
          </FadeUp>
          <FadeUp delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={ctaBandContent.primary.href} variant="primary" size="lg">
                {ctaBandContent.primary.label}
              </Button>
              <Button
                href={ctaBandContent.secondary.href}
                variant="outlineLight"
                size="lg"
              >
                {ctaBandContent.secondary.label}
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
