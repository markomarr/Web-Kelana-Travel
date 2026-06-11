"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const AUTO_SCROLL_INTERVAL = 4000;
const SWIPE_THRESHOLD = 50;

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [index, testimonials.length]
  );

  useEffect(() => {
    if (paused || shouldReduceMotion || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, shouldReduceMotion, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goTo(index - 1);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goTo(index + 1);
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div
      className="mx-auto max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.article
            key={current.id}
            custom={direction}
            variants={shouldReduceMotion ? undefined : variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex cursor-grab flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 active:cursor-grabbing sm:p-8"
          >
            <div className="flex items-center gap-1" aria-label={`Rating ${current.rating} dari 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < current.rating ? "fill-accent text-accent" : "text-white/20"}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-white/80 sm:text-base">&ldquo;{current.review}&rdquo;</p>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="font-display text-sm font-bold text-white">{current.name}</p>
              {current.routeUsed && (
                <p className="mt-1 text-xs text-white/50">Rute: {current.routeUsed}</p>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Lihat testimoni ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
