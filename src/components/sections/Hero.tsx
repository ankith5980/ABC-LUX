/* =============================================================
   Hero.tsx — Main Landing Section
   =============================================================
   Purpose   : Renders the initial viewport experience featuring a massive animated headline and chandelier.
   Used by   : Home page index.tsx
   Depends on: gsap, ScrollTrigger, TitleReveal, usePreloader
   Notes     : Employs a complex pinned scroll sequence where the dark floor sweeps up to transition into the next section.
   ============================================================= */

import { useEffect, useRef } from "react";
import { getAnimationContext } from "@/utils/gsap-setup";
import TitleReveal from "../ui/TitleReveal";
import { usePreloader } from "@/hooks/usePreloader";
import chandelierUrl from "@/assets/Pendant-Light-33212-25-D800xH780-Gold.webp";
import wBg from "@/assets/w-bg.webp";

/**
 * Hero
 * The top-most section of the application.
 * Manages entrance animations tied to preloader completion and handles the scroll-pinned transition to the "About" section.
 * Props: None
 */
export function Hero() {
  const root = useRef<HTMLDivElement | null>(null);
  const entryPlayed = useRef(false);
  const { isLoaded } = usePreloader();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;


    const { gsap } = getAnimationContext('hero');
    const ctx = gsap.context(() => {
      // Subtle pendulum sway on the chandelier - runs always
      gsap.to(".lux-hero-rock", {
        rotate: 0.8,
        transformOrigin: "50% 0%",
        duration: 5.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll: pin and reveal the obsidian floor sweeping up + fade beige
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=80%",
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }) as gsap.core.Timeline;

      tl
        .to(".lux-hero-floor", {
          yPercent: -72,
          ease: "none",
          duration: 1,
        }, 0)
        .to(".lux-hero-rock", { scale: 1.25, ease: "none", duration: 1 }, 0)
        .to(".lux-hero-headline", { y: "-45vh", opacity: 0, ease: "none", duration: 0.4 }, 0)
        .to(".lux-hero-cta", { y: "-120vh", ease: "none", duration: 1 }, 0)
        .to(".lux-hero-meta", { opacity: 0, ease: "none", duration: 0.3 }, 0)
        .to(root.current, { backgroundColor: "#0E0D0E", ease: "none", duration: 0.5 }, 0.3);
    }, root);

    return () => ctx.revert();
  }, []); // Scroll animations only setup once

  // Entry animation - runs when preloader is complete
  useEffect(() => {
    if (!isLoaded) return;
    if (entryPlayed.current) return; // Prevent replay

    // Force a ScrollTrigger recalculation once the preloader is fully gone
    // to ensure the Hero pin spacer height is 100% correct
    const { ScrollTrigger } = getAnimationContext('hero');
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    entryPlayed.current = true;
  }, [isLoaded]);

  return (
    <section
      ref={root}
      id="top"
      className="lux-hero-bg lux-grain relative z-50 h-screen w-full overflow-visible"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      {/* White background image */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${wBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Soft overlay to blend image with brand tones */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,248,235,0.18) 0%, rgba(245,240,232,0) 60%), radial-gradient(ellipse at 50% 100%, rgba(245,240,232,0.55) 0%, rgba(245,240,232,0) 60%)",
        }}
      />

      {/* SVG decorative path line */}
      <svg
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        style={{ aspectRatio: '1440 / 1080', transform: 'translateZ(0)' }}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
      >
        <linearGradient id="welcome-path-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A68773" />
          <stop offset=".5" stopColor="#9FAF9B" />
          <stop offset="1" stopColor="#151415" />
        </linearGradient>
        <path
          fill="none"
          stroke="url(#welcome-path-gradient)"
          strokeWidth="1"
          d="M859,0c513,94.4,377,448.9-79,595.4-424,136.3-685,299.7-263,484.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>



      {/* Periphery utility text */}
      <div className="lux-hero-meta pointer-events-none absolute inset-0 z-30 text-obsidian">
        <div className="absolute left-8 top-[38%] hidden max-w-[160px] md:block">
          <p className="font-serif text-[13px] leading-snug">
            Crafted Illumination<br />for Interiors
          </p>
        </div>
        <div className="absolute right-8 top-[28%] hidden max-w-[160px] text-right md:block">
          <p className="font-serif text-[13px] leading-snug">
            Designed to<br />Transform Spaces
          </p>
        </div>

      </div>



      {/* Massive serif headline — Character Reveal applied with z-layering preserved */}
      <div className="lux-hero-headline pointer-events-none absolute inset-x-0 top-[15vh] md:top-[20vh] z-50 flex flex-col items-center text-white">
        <h1 className="text-center leading-[0.86] tracking-[-0.045em]" style={{ fontFamily: "'Runalto', serif" }}>
          <TitleReveal
            text="Illuminate"
            className="translate-x-[4vw] text-[14vw] md:text-[12vw] font-medium lg:text-[11vw] justify-center"
          />
        </h1>
      </div>
      <div className="lux-hero-headline pointer-events-none absolute inset-x-0 top-[15vh] md:top-[20vh] z-30 flex flex-col items-center text-white">
        <h1 className="text-center leading-[0.86] tracking-[-0.045em]" style={{ fontFamily: "'Runalto', serif" }}>
          <span className="block invisible text-[14vw] md:text-[12vw] font-medium lg:text-[11vw]">Illuminate</span>
          <TitleReveal
            text="Every"
            className="-mt-[0.5vw] block translate-x-[-18vw] text-[14vw] md:text-[12vw] font-light italic lg:text-[11vw] justify-center"
          />
        </h1>
      </div>
      <div className="lux-hero-headline pointer-events-none absolute inset-x-0 top-[15vh] md:top-[20vh] z-30 flex flex-col items-center text-white">
        <h1 className="text-center leading-[0.86] tracking-[-0.045em]" style={{ fontFamily: "'Runalto', serif" }}>
          <span className="block invisible text-[14vw] md:text-[12vw] font-medium lg:text-[11vw]">Illuminate</span>
          <span className="-mt-[0.5vw] block invisible text-[14vw] md:text-[12vw] font-light italic lg:text-[11vw]">Every</span>
          <TitleReveal
            text="Space"
            className="-mt-[1.5vw] block translate-x-[12vw] text-[14vw] md:text-[12vw] font-medium lg:text-[11vw] justify-center"
          />
        </h1>
      </div>

      {/* Centerpiece chandelier — suspended, sits in front of middle headline word */}
      <div className="pointer-events-none absolute inset-x-0 top-[-12vh] z-40 flex items-start justify-center">
        <div
          className="lux-hero-rock flex flex-col items-center"
          style={{ willChange: "transform", transformOrigin: "50% 0%" }}
        >
          {/* Extended CSS Chain — removed */}
          <img
            src={chandelierUrl}
            alt="ABC LUX Pendant Light"
            fetchPriority="high"
            width={1080}
            height={1080}
            className="h-[78vh] md:h-[108vh] w-auto select-none object-contain md:drop-shadow-[0_60px_80px_rgba(0,0,0,0.7)] -mt-[2px]"
          />
        </div>
      </div>

      {/* SEEK ADMISSION pill */}
      <div className="lux-hero-cta absolute left-1/2 top-[96vh] md:top-[94vh] z-50 -translate-x-1/2 w-max">
        <a
          href="#collections"
          data-cursor="ENTER"
          className="lux-eyebrow inline-flex items-center gap-4 md:gap-6 rounded-full bg-[#F4EEE0] px-5 py-3 md:px-7 md:py-4 text-obsidian shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02]"
        >
          <span className="text-[10px] md:text-[12px]">Explore Collections</span>
          <span className="inline-block h-2 w-2 rounded-full bg-obsidian" />
        </a>
      </div>

      {/* Black curved floor — sweeps up on scroll with warm-to-obsidian blend */}
      <div
        id="hero-curve"
        className="lux-hero-floor pointer-events-none absolute inset-x-[-60%] bottom-[-120vh] z-15 h-[130vh]"
        style={{
          background: "#0E0D0E",
          borderTopLeftRadius: "50% 100%",
          borderTopRightRadius: "50% 100%",
          willChange: "transform",
        }}
      />

    </section>
  );
}