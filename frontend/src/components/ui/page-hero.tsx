import Image from "next/image";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  className?: string;
}) {
  return (
    <section className={cn("relative min-h-[62vh] overflow-hidden bg-ink", className)}>
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
      <div className="overlay-hero absolute inset-0" />
      <div className="relative z-10 flex min-h-[62vh] items-end">
        <div className="container-premium pb-16 pt-36 md:pb-20">
          {eyebrow && (
            <FadeUp>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                {eyebrow}
              </p>
            </FadeUp>
          )}
          <FadeUp delay={0.08}>
            <h1 className="font-display max-w-4xl text-4xl leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>
          </FadeUp>
          {description && (
            <FadeUp delay={0.14}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                {description}
              </p>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}
