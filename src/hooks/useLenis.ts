/* =============================================================
   useLenis.ts — Smooth Scrolling Integration
   =============================================================
   Purpose   : Initializes and manages the Lenis smooth scrolling instance globally.
   Used by   : RootLayout (src/pages/__root.tsx)
   Depends on: lenis, gsap, ScrollTrigger
   Notes     : Disables itself on mobile/tablet to defer to native scrolling.
               Syncs Lenis scroll ticks with GSAP's ticker for jank-free animations.
   ============================================================= */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

import { isMobileOrTablet } from "../utils/device";

let lenisInstance: Lenis | null = null;

/**
 * getLenis
 * Exposes the active Lenis instance for programmatic scrolling globally.
 * @returns {Lenis | null} The active instance or null if uninitialized/disabled.
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * useLenis
 * A custom hook that mounts the Lenis smooth scrolling library on the document.
 * Handles resizing, ScrollTrigger integration, and teardown.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Skip Lenis and ScrollTrigger setup on mobile/tablet devices
    if (isMobileOrTablet()) {
      return;
    }

    // Prevent browser scroll restoration from fighting Lenis
    history.scrollRestoration = "manual";

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash) as HTMLElement;
        if (el) {
          lenis.scrollTo(el, { immediate: true });
        }
      }
    };

    // Refresh ScrollTrigger after initial load to fix layout shifts
    const handleLoad = () => {
      ScrollTrigger.refresh();
      scrollToHash();
    };
    window.addEventListener("load", handleLoad);
    
    // Staggered refreshes to catch late-loading images / layout reflows
    // Fire after preloader finishes (~2600ms total) not during it
    const timer1 = setTimeout(() => { ScrollTrigger.refresh(); scrollToHash(); }, 2400);
    const timer2 = setTimeout(() => { ScrollTrigger.refresh(); scrollToHash(); }, 3200);

    // Run once quickly for client-side navigation
    setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToHash();
    }, 150);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisInstance = null;
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer1);
      clearTimeout(timer2);
      history.scrollRestoration = "auto";
    };
  }, []);
}
