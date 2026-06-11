"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface FadeInOnScrollProps {
  children: React.ReactNode;
  /** Index untuk stagger — delay = index * 0.1s */
  index?: number;
  /** Delay tambahan dalam detik */
  delay?: number;
  className?: string;
  /** Element wrapper, default "div" */
  as?: "div" | "li";
}

/**
 * Fade + translateY(20px) -> normal saat masuk viewport.
 * Hormati prefers-reduced-motion (skip animasi).
 */
export function FadeInOnScroll({
  children,
  index = 0,
  delay = 0,
  className,
  as = "div",
}: FadeInOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const totalDelay = delay + index * 0.1;

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: totalDelay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}
