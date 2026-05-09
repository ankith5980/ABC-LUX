import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

function isMobileOrTablet() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  try {
    if (window.matchMedia && (window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches)) {
      return true;
    }
  } catch (e) {
    // ignore
  }
  const ua = navigator.userAgent || "";
  return /Mobi|Android|iPhone|iPad|Tablet/.test(ua);
}

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

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
