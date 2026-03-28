"use client";

import { useEffect, useRef } from "react";

export function useScrollVideo(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {/* autoplay blocked */});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
