"use client";

import { useEffect } from "react";

/**
 * Attaches an IntersectionObserver that adds `.is-visible` to any element
 * that has a `.reveal` or `.reveal-scale` class once it enters the viewport.
 * This component renders nothing — it's a pure side-effect hook mounted
 * once at the page level.
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Make everything visible immediately
      document
        .querySelectorAll<HTMLElement>(".reveal, .reveal-scale")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Once revealed, stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-scale"
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
