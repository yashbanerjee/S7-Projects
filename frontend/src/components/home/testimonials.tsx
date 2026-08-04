"use client";

import { SectionHeading, FadeUp } from "@/components/ui/motion";
import type { fallbackTestimonials } from "@/lib/content";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

type T = (typeof fallbackTestimonials)[number];

export function Testimonials({ items }: { items: T[] }) {
  return (
    <section className="section-pad bg-ink text-white">
      <div className="container-premium">
        <SectionHeading
          light
          eyebrow="Testimonials"
          title="Trusted by ambitious organisations"
          description="Client voices from programmes where brand reputation and live execution leave no margin for error."
        />

        <FadeUp delay={0.12}>
          <div className="mt-14">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
              className="!pb-14"
            >
              {items.map((t) => (
                <SwiperSlide key={t.name}>
                  <blockquote className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-8">
                    <p className="text-lg leading-relaxed text-white/85">“{t.content}”</p>
                    <footer className="mt-10">
                      <p className="font-display text-xl">{t.name}</p>
                      <p className="mt-1 text-sm text-white/55">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </p>
                    </footer>
                  </blockquote>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
