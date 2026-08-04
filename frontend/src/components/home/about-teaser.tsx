import Image from "next/image";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { images, aboutContent } from "@/lib/content";
import { Button } from "@/components/ui/button";

export function AboutTeaser() {
  const collage = [
    { src: images.about, alt: "Premium evening reception atmosphere", className: "aspect-[4/5]" },
    { src: images.booth, alt: "Custom exhibition stand on a trade-show floor", className: "aspect-[4/3]" },
    { src: images.networking, alt: "Guests networking at a luxury corporate event", className: "aspect-[4/3]" },
  ];

  return (
    <section className="section-pad bg-white">
      <div className="container-premium grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FadeUp className="row-span-2">
              <div className={`relative overflow-hidden image-zoom ${collage[0].className} h-full min-h-[280px] md:min-h-[420px]`}>
                <Image
                  src={collage[0].src}
                  alt={collage[0].alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                  priority
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className={`relative overflow-hidden image-zoom ${collage[1].className}`}>
                <Image
                  src={collage[1].src}
                  alt={collage[1].alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.18}>
              <div className={`relative overflow-hidden image-zoom ${collage[2].className}`}>
                <Image
                  src={collage[2].src}
                  alt={collage[2].alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.22}>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Exhibition · Staging · Hospitality
            </p>
          </FadeUp>
        </div>

        <div className="lg:col-span-6 lg:pl-4">
          <SectionHeading
            eyebrow="About Project S7"
            title="Luxury craft. Operational precision."
            description={aboutContent.story}
          />
          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              {aboutContent.storyContinued}
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="mt-10">
              <Button href="/about" variant="outline">
                Discover Our Story
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
