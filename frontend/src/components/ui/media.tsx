"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ParallaxImage({
  src,
  alt,
  className,
  priority,
  sizes = "100vw",
  overlay,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: "soft" | "hero" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-[-12%] h-[124%] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </motion.div>
      {overlay && overlay !== "none" && (
        <div
          className={cn(
            "absolute inset-0 z-[1]",
            overlay === "hero" ? "overlay-hero" : "overlay-soft"
          )}
        />
      )}
    </div>
  );
}

export function MediaImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  zoom = true,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  zoom?: boolean;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", !fill && className)}
    />
  );

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", zoom && "image-zoom", className)}>
        {img}
      </div>
    );
  }

  return zoom ? <div className={cn("image-zoom", className)}>{img}</div> : img;
}
