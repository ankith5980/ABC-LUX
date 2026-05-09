/* =============================================================
   useMagnetic.ts — Magnetic Hover Physics
   =============================================================
   Purpose   : Provides a hook to make DOM elements pull towards the mouse on hover.
   Used by   : Header (src/components/sections/Header.tsx), buttons, etc.
   Depends on: react, gsap
   Notes     : Automatically disables on touch devices (where hover: none is true).
   ============================================================= */

import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap-setup";

/**
 * useMagnetic
 * Attaches mousemove listeners to an element to offset its x/y position towards the cursor,
 * creating a "magnetic" or "sticky" physical effect.
 * @param {number} strength - A multiplier determining how strongly the element tracks the mouse (default: 0.35)
 * @returns {React.RefObject<T>} A ref to attach to the target DOM element.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  // Effect: Bind mouse event listeners to the ref element and initialize GSAP quickTo setters
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        xTo(x);
        yTo(y);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => ctx.revert();
  }, [strength]);

  return ref;
}
