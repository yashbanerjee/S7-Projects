import Image from "next/image";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { images, aboutContent } from "@/lib/content";

export function AboutTeaser() {
  return (
    <section className="section-pad bg-white">
      <div className="container-premium grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="relative lg:col-span-6">
          <FadeUp>
            <div className="relative aspect-[4/5] overflow-hidden image-zoom">
              <Image
                src={images.about}
                alt="Project S7 team coordinating a premium exhibition environment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="absolute -bottom-8 -right-2 hidden w-[52%] overflow-hidden border-[10px] border-white shadow-xl md:block lg:-right-8">
              <div className="relative aspect-[4/3]">
                <Image
                  src={images.networking}
                  alt="Business networking at a luxury corporate event"
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="lg:col-span-6 lg:pl-6">
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
