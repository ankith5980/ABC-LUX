import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;


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

    // Refresh ScrollTrigger after initial load to fix layout shifts
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);
    // Staggered refreshes to catch late-loading images / layout reflows
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 1000);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisInstance = null;
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
}
