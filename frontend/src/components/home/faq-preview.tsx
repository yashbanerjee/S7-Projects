"use client";

import { useState } from "react";
import { SectionHeading, FadeUp } from "@/components/ui/motion";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { fallbackFaqs } from "@/lib/content";
import { Button } from "@/components/ui/button";

type F = (typeof fallbackFaqs)[number];

export function FaqPreview({ items }: { items: F[] }) {
  const [open, setOpen] = useState(0);
  const list = items.slice(0, 5);

  return (
    <section className="section-pad bg-soft">
      <div className="container-premium grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before the first brief"
            description="A short selection of the questions organisations ask when evaluating a luxury exhibitions partner."
          />
          <FadeUp delay={0.12}>
            <div className="mt-8">
              <Button href="/faq" variant="outline">
                View All FAQs
              </Button>
            </div>
          </FadeUp>
        </div>
        <div className="lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {list.map((faq, i) => {
              const isOpen = open === i;
              return (
                <FadeUp key={faq.question} delay={i * 0.04}>
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-lg tracking-tight md:text-xl">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "mt-1 h-5 w-5 shrink-0 text-pink transition",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pr-10 text-base leading-relaxed text-muted">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                </FadeUp>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
