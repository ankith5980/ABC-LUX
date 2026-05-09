/* =============================================================
   Collections.tsx — Featured Collections Section
   =============================================================
   Purpose   : Showcases product collections using a complex scroll-driven masonry-to-center animation on desktop, and a Swiper coverflow carousel on mobile.
   Used by   : Home page index.tsx
   Depends on: gsap, ScrollTrigger, Swiper
   Notes     : On desktop, the central card expands to fill the viewport and then shrinks into a "tombstone" shape via ScrollTrigger pinning.
   ============================================================= */

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import dc1 from "@/assets/Designer-Chandeliers-1.webp";
import dc2 from "@/assets/Designer-Chandeliers-2.webp";
import dc3 from "@/assets/Designer-Chandeliers-3.webp";
import dc4 from "@/assets/Designer-Chandeliers-4.webp";
import dc5 from "@/assets/Designer-Chandeliers-5.webp";
import dc6 from "@/assets/Designer-Chandeliers-6.webp";
import dc7 from "@/assets/Designer-Chandeliers-7.webp";
import TitleReveal from "../ui/TitleReveal";

const SHOWCASE = [
  { img: dc1, title: "Designer Chandeliers" },
  { img: dc2, title: "Designer Chandeliers" },
  { img: dc3, title: "Designer Chandeliers" },
  { img: dc4, title: "Designer Chandeliers" },
  { img: dc5, title: "Designer Chandeliers" },
  { img: dc6, title: "Designer Chandeliers" },
  { img: dc7, title: "Designer Chandeliers" },
];


/**
 * Places
 * The main Collections showcase section.
 * - Mobile/Tablet: Uses Swiper.js for a swipeable coverflow carousel.
 * - Desktop: Uses a pinned ScrollTrigger sequence to animate a masonry grid into a focused, centered card layout.
 * Props: None
 */
export function Places() {
  const root = useRef<HTMLElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const leftTopRef = useRef<HTMLElement | null>(null);
  const leftBottomRef = useRef<HTMLElement | null>(null);
  const rightTop1Ref = useRef<HTMLElement | null>(null);
  const rightTop2Ref = useRef<HTMLElement | null>(null);
  const rightBottomRef = useRef<HTMLElement | null>(null);
  const centerBottomRef = useRef<HTMLElement | null>(null);
  const [idx, setIdx] = useState(0);


  // Effect: Desktop-only scroll animations (masonry grid into tombstone center card)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;



    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        ".lux-places-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".lux-places-headline", start: "top 75%" },
        },
      );

      gsap.fromTo(
        ".lux-places-caption",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
          scrollTrigger: { trigger: ".lux-places-headline", start: "top 65%" },
        },
      );

      // Tile reveals (clipPath) - all tiles
      (gsap as any).utils.toArray(".lux-place-tile").forEach((tile: HTMLElement) => {
        gsap.set(tile, { willChange: "transform, clip-path" });
        gsap.fromTo(
          tile,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: tile, start: "top 92%" },
          },
        );
      });

      // Parallax effect ONLY for center tiles (not side tiles)
      (gsap as any).utils.toArray(".lux-place-tile[data-parallax]").forEach((tile: HTMLElement) => {
        const speed = Number(tile.dataset.speed || -10);
        const inner = tile.querySelector(".lux-place-img") as HTMLElement;

        if (inner) {
          gsap.set(inner, { willChange: "transform" });
        }

        gsap.to(tile, {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
        });

      });

      // Warm cap
      gsap.fromTo(
        ".lux-places-cap",
        { yPercent: -30, opacity: 0.6 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=60%",
            scrub: true,
          },
        },
      );

      // ===== SOPHISTICATED SCROLL-DRIVEN ANIMATION =====
      // Phase 1: Center expands from center, side images move in their directions
      // Phase 2: Card shrinks to compact with tombstone border radius
      // Phase 3: Objects section emerges

      const showcase = showcaseRef.current;
      const centerCard = showcase?.querySelector('.center-card-inner') as HTMLElement;

      if (showcase && centerCard && scrollContainerRef.current) {
        // Set transform origin to center for proper expansion
        gsap.set(centerCard, { transformOrigin: 'center center' });

        // Compute scale that fills the viewport with a 35px gap on every side
        const gap = 35;
        const scaleX = (window.innerWidth - gap * 2) / centerCard.offsetWidth;
        const scaleY = (window.innerHeight - gap * 2) / centerCard.offsetHeight;
        const fillScale = Math.min(scaleX, scaleY);

        // Compute yOffset via offsetParent traversal — stable at any scroll position.
        // getBoundingClientRect() fails here because the card is below the fold at
        // mount time; offsetTop accumulation is document-position based (no scroll bias).
        const scrollEl = scrollContainerRef.current!;
        let node: HTMLElement | null = centerCard;
        let topFromContainer = 0;
        while (node && node !== scrollEl) {
          topFromContainer += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        const cardCenterFromTop = topFromContainer + centerCard.offsetHeight / 2;
        const yOffset = window.innerHeight / 2 - cardCenterFromTop;

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "+=500%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 (0%–45%): card scales up to fill viewport, centered
        scrollTl.to(centerCard, {
          scale: fillScale,
          y: yOffset,
          borderRadius: '16px',
          ease: 'power2.inOut',
          duration: 45,
        }, 0);

        // Side images exit in their directions
        if (leftTopRef.current) scrollTl.to(leftTopRef.current, { x: -400, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);
        if (leftBottomRef.current) scrollTl.to(leftBottomRef.current, { x: -400, y: 200, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);
        if (rightTop1Ref.current) scrollTl.to(rightTop1Ref.current, { y: -400, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);
        if (rightTop2Ref.current) scrollTl.to(rightTop2Ref.current, { x: 400, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);
        if (centerBottomRef.current) scrollTl.to(centerBottomRef.current, { y: 400, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);
        if (rightBottomRef.current) scrollTl.to(rightBottomRef.current, { y: 400, x: 200, opacity: 0, ease: 'power2.inOut', duration: 45 }, 0);

        // Phase 2 (45%–100%): shrink to tombstone portrait shape
        scrollTl.to(centerCard, {
          scale: 1,
          width: '22vw',
          height: '60vh',
          y: yOffset + window.innerHeight * 0.06,
          borderRadius: '999px 999px 12px 12px',
          ease: 'power2.inOut',
          duration: 55,
        }, 45);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  // Animate showcase image swap
  // Effect: Animates the text content of the center card when navigating between slides
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lux-showcase-img",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "expo.out" },
      );
      gsap.fromTo(
        ".lux-showcase-title",
        { yPercent: 80, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", delay: 0.1 },
      );
    });
    return () => ctx.revert();
  }, [idx]);

  const next = () => { setIdx((i) => (i + 1) % SHOWCASE.length); };
  const prev = () => { setIdx((i) => (i - 1 + SHOWCASE.length) % SHOWCASE.length); };
  const current = SHOWCASE[idx];



  return (
    <section
      ref={root}
      id="collections"
      className="relative z-10 w-full overflow-visible bg-[#0E0D0E]"
    >
      
      {/* Solid background */}
      <div
        className="absolute inset-0 z-0 bg-[#0E0D0E]"
      />



      {/* Decorative SVG path */}
      <svg
        className="pointer-events-none absolute inset-x-0 z-1 w-full -top-4 lg:-top-32"
        style={{ aspectRatio: '1440 / 1080' }}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden
      >
        <linearGradient id="spaces-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15141500" />
          <stop offset=".5" stopColor="#7b5136" />
          <stop offset="1" stopColor="#15141500" />
        </linearGradient>
        <path
          fill="none"
          stroke="url(#spaces-grad)"
          strokeWidth="1"
          d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Headline block */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-6 pt-[12vh] lg:pt-[22vh] lg:px-12">
        <div className="lux-places-headline relative">
          <h2 className="text-center leading-[0.88] tracking-[-0.045em]" style={{ fontFamily: "'Runalto', serif" }}>
            <span className="block overflow-hidden">
              <TitleReveal
                text="Explore"
                className="block text-[12vw] font-medium text-[#F1EBDD] lg:text-[10vw] justify-center"
              />
            </span>
            <span className="block overflow-hidden">
              <TitleReveal
                text="Collections"
                className="block text-[14vw] font-medium lg:text-[12vw] justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #F1EBDD 0%, #C9C0B0 35%, #5A5550 70%, #1A1819 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "0.05em",
                }}
              />
            </span>
          </h2>

          <div className="lux-places-caption font-serif mt-8 text-center text-[clamp(20px,2.4vw,40px)] leading-[1.05] text-[#E8E1D2]">
            {/* Mobile/Tablet: Two lines */}
            <div className="lg:hidden">
              <span className="block md:inline">Where Light </span>
              <span className="block md:inline">Defines Space</span>
            </div>
            {/* Desktop: Three lines */}
            <div className="hidden lg:block">
              <span className="block">Where</span>
              <span className="block">Light Defines</span>
              <span className="block">Space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Container for sophisticated animation */}
      <div ref={scrollContainerRef} className="scroll-container relative z-20 h-screen overflow-hidden">
        <div className="sticky-scene relative h-full">
          {/* MOBILE/TABLET VIEW: Swiper Cover-flow Carousel (Hidden on desktop) */}
          <div className="flex lg:hidden flex-col items-center justify-center px-0 pt-[4vh] pb-[8vh] w-full overflow-hidden relative">
            <Swiper
              modules={[Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              loopAdditionalSlides={2}
              speed={1200}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              watchSlidesProgress={true}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              className="w-full h-[53vh] max-h-[440px] min-h-[350px] mt-[2vh]"
            >
              {SHOWCASE.map((item, index) => (
                <SwiperSlide key={index} className="w-[64vw]! md:w-[45vw]! max-w-[295px] md:max-w-[400px] h-full lux-swiper-slide">
                  {({ isActive }) => (
                    <div
                      className="relative w-full h-full aspect-2/3 overflow-hidden"
                      style={{ borderRadius: '250px 250px 0 0' }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        width={4320}
                        height={5400}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Title Over Image */}
                      <div 
                        className="lux-swiper-title absolute inset-0 flex items-end justify-center px-6 pb-2 pt-6 transition-opacity duration-500"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        <h3
                          className="text-center text-[7vw] md:text-[5vw] leading-tight text-white mb-[1vh]"
                          style={{ fontFamily: "'Runalto', serif" }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>


          {/* DESKTOP VIEW: Original Masonry Grid Layout (Hidden on mobile/tablet) */}
          <div ref={gridContainerRef} className="hidden lg:block relative z-10 mx-auto pt-[16vh] w-full max-w-[1600px] px-4 md:px-8">
            <div
              className="grid w-full gap-4 md:gap-8"
              style={{
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'auto auto auto',
              }}
            >
              {/* === LEFT COLUMN === */}
              {/* LEFT TOP — Large card (cols 1-3, row 1) */}
              <figure
                ref={leftTopRef}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '1 / 4', gridRow: '1', marginTop: '-7vh' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '3/4', maxHeight: '280px' }}>
                  <img
                    src={dc1}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    decoding="async"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>

              {/* LEFT BOTTOM — Small card (cols 1-3, row 3) */}
              <figure
                ref={leftBottomRef}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '1 / 4', gridRow: '3', marginTop: '-2vh' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={dc7}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    decoding="async"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>

              {/* === CENTER COLUMN === */}
              {/* CENTER HERO — Large static rectangle (cols 4-10, spans all 3 rows) */}
              <div
                ref={showcaseRef}
                data-static="true"
                className="relative z-20"
                style={{ gridColumn: '4 / 10', gridRow: '1 / 4', marginTop: '4vh' }}
              >
                {/* Wrapper to hold the grid space so animating the card doesn't reflow the DOM and break the pin-spacer */}
                <div className="relative w-full" style={{ aspectRatio: '21/9', minHeight: '40vh' }}>
                  <div 
                    className="center-card-inner absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden rounded-lg bg-black origin-center"
                    style={{ willChange: 'transform, border-radius' }}
                  >
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                      <img
                        key={current.img}
                        src={current.img}
                        alt={current.title}
                        width={4320}
                        height={5400}
                        className="lux-showcase-img"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          willChange: 'transform',
                        }}
                      />
                    </div>


                    {/* Title */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 md:left-12">
                      <h3
                        key={`t-${idx}`}
                        className="lux-showcase-title text-[4vw] md:text-[1.8vw] leading-none text-white"
                        style={{ fontFamily: "'Runalto', serif" }}
                      >
                        {current.title}
                      </h3>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-8 right-8 text-white text-xl md:text-2xl">
                      <span>{String(idx + 1).padStart(1, "0")}</span>
                      <span className="opacity-50">/{SHOWCASE.length}</span>
                    </div>

                    {/* Navigation (desktop) */}
                    <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-6">
                      <button
                        type="button"
                        onClick={prev}
                        data-cursor="PREV"
                        aria-label="Previous"
                        className="grid h-14 w-14 place-items-center rounded-full bg-black/80 text-white transition-transform hover:scale-105 md:h-16 md:w-16"
                      >
                        <svg width="24" height="14" viewBox="0 0 22 14" fill="none">
                          <path d="M21 7H1M1 7L7 1M1 7L7 13" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <div style={{ position: "relative", display: "inline-flex" }}>
                        <button
                          type="button"
                          onClick={next}
                          data-cursor="NEXT"
                          aria-label="Next"
                          className="grid h-14 w-14 place-items-center rounded-full bg-black/80 text-white transition-transform hover:scale-105 md:h-16 md:w-16"
                        >
                          <svg width="24" height="14" viewBox="0 0 22 14" fill="none">
                            <path d="M1 7H21M21 7L15 1M21 7L15 13" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === RIGHT COLUMN === */}
              {/* RIGHT TOP — Extra small card filling the gap (cols 8-10, row 1) */}
              <figure
                ref={rightTop1Ref}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '8 / 10', gridRow: '1', marginLeft: '2vw', marginTop: '-18vh' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={dc2}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    decoding="async"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>

              {/* RIGHT TOP — Small wide card (cols 10-13, row 1) */}
              <figure
                ref={rightTop2Ref}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '10 / 13', gridRow: '1', marginLeft: '1vw' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16/9', minHeight: '170px' }}>
                  <img
                    src={dc4}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    decoding="async"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>

              {/* CENTER BOTTOM — New card in marked area (cols 5-9, row 3) */}
              <figure
                ref={centerBottomRef}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '5 / 9', gridRow: '3', marginTop: '12vh', marginLeft: '-120px' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16/9', minHeight: '140px', maxWidth: '320px' }}>
                  <img
                    src={dc3}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    decoding="async"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>

              {/* RIGHT BOTTOM — Large card (cols 10-12, row 3) */}
              <figure
                ref={rightBottomRef}
                className="lux-place-tile relative z-10"
                data-cursor="VIEW"
                data-static="true"
                style={{ gridColumn: '10 / 13', gridRow: '3', marginTop: '-8vh', marginLeft: '2vw' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '4/3', minHeight: '200px' }}>
                  <img
                    src={dc5}
                    alt="Designer Chandeliers"
                    width={4320}
                    height={5400}
                    loading="lazy"
                    className="lux-place-img absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>

        {/* Star mask at bottom-center of Places (division line above Testimonials) */}
        <div className="absolute bottom-0 left-1/2 z-10 w-24 h-24 -translate-x-1/2 translate-y-1/2 pointer-events-none text-[#0E0D0E]">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M50,0c0,27.6,22.4,50,50,50-27.6,0-50,22.4-50,50,0-27.6-22.4-50-50-50,27.6,0,50-22.4,50-50Z" />
          </svg>
        </div>

      </section>
  );
}
