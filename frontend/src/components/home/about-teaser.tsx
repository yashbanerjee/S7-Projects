import Image from "next/image";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { images } from "@/lib/content";
import { aboutSection } from "@/lib/brief-content";
import Link from "next/link";

export function AboutTeaser() {
  return (
    <section className="section-pad bg-white" id="about">
      <div className="container-premium grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <FadeUp className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden image-zoom md:aspect-[5/6]">
            <Image
              src={images.build}
              alt="Premium exhibition stand build and production on a show floor"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden aspect-[4/3] w-[42%] overflow-hidden border-4 border-white shadow-xl image-zoom md:block lg:-right-8">
            <Image
              src={images.stage}
              alt="Large-scale event production with LED staging"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        </FadeUp>

        <div className="lg:col-span-6 lg:pl-6">
          <SectionHeading eyebrow={aboutSection.eyebrow} title={aboutSection.title} />
          {aboutSection.copy.map((paragraph, i) => (
            <FadeUp key={i} delay={0.08 + i * 0.06}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">{paragraph}</p>
            </FadeUp>
          ))}
          <FadeUp delay={0.22}>
            <Link
              href={aboutSection.cta.href}
              className="mt-10 inline-flex items-center justify-center rounded-full border-2 border-ink px-8 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition hover:border-pink hover:text-pink"
            >
              {aboutSection.cta.label}
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
