"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/brand";
import { motion } from "framer-motion";

export function FloatingCta() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const wa = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Project S7, I would like to discuss an event.")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
    >
      <Link
        href="/quote"
        className="btn-pink hidden sm:inline-flex items-center justify-center rounded-full bg-pink px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-pink/25 transition hover:bg-pink-soft hover:text-white"
      >
        Get a Quote
      </Link>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition hover:bg-pink hover:text-white"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </motion.div>
  );
}
