"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { fallbackFaqs } from "@/lib/content";

type F = (typeof fallbackFaqs)[number];

export function FaqClient({ faqs }: { faqs: F[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query) ||
        f.category?.toLowerCase().includes(query)
    );
  }, [faqs, q]);

  return (
    <section className="section-pad bg-white">
      <div className="container-premium max-w-4xl">
        <FadeUp>
          <div className="mb-12 flex items-center gap-3 border-b border-line pb-3">
            <Search className="h-5 w-5 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-transparent text-base outline-none placeholder:text-muted"
              aria-label="Search FAQs"
            />
          </div>
        </FadeUp>

        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li key={faq.question}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 py-7 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>
                    {faq.category && (
                      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-pink">
                        {faq.category}
                      </span>
                    )}
                    <span className="font-display text-xl tracking-tight md:text-2xl">
                      {faq.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn("mt-2 h-5 w-5 shrink-0 text-pink transition", isOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-12 text-base leading-relaxed text-muted md:text-lg">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted">No matching questions.</p>
        )}
      </div>
    </section>
  );
}
