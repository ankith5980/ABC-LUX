import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import tImg1 from "@/assets/lux-1.jpg";
import tImg2 from "@/assets/lux-2.jpg";
import tImg3 from "@/assets/lux-3.jpg";
import tImg4 from "@/assets/lux-4.jpg";
import tImg5 from "@/assets/lux-5.jpg";
import tImg6 from "@/assets/lux-6.jpg";

// ─── Data ────────────────────────────────────────────────────────────────────

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  excerpt: string;
  hue: number;
  initials: string;
  img: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1, name: "LED Strip Lights", role: "", company: "",
    excerpt: "Professional Illumination",
    quote: "Professional grade LED strips designed for seamless architectural integration. High CRI, uniform brightness, and exceptional longevity for premium residential and commercial spaces.",
    hue: 38, initials: "LS", img: tImg1,
  },
  {
    id: 2, name: "Magnetic Profile Lights", role: "", company: "",
    excerpt: "Modular Flexibility",
    quote: "Our magnetic track system offers ultimate flexibility. Easily move, swap, and adjust lighting modules without tools, creating a dynamic lighting environment that evolves with your space.",
    hue: 200, initials: "MP", img: tImg2,
  },
  {
    id: 3, name: "Modern Pendant Light", role: "", company: "",
    excerpt: "Artistic Elegance",
    quote: "A statement of elegance. Our modern pendants combine hand-blown glass with precision-machined metals to create a focal point that is both a light source and a work of art.",
    hue: 280, initials: "PL", img: tImg3,
  },
  {
    id: 4, name: "Ceiling Lights", role: "", company: "",
    excerpt: "Ambient Sophistication",
    quote: "Sophisticated surface and recessed ceiling solutions. Designed to provide beautiful ambient light while maintaining a clean, minimalist aesthetic across any interior architecture.",
    hue: 140, initials: "CL", img: tImg4,
  },
  {
    id: 5, name: "Designer Chandeliers", role: "", company: "",
    excerpt: "Grand Installations",
    quote: "The pinnacle of luxury illumination. Our bespoke chandeliers are engineered to transform grand spaces with breathtaking light patterns and timeless craftsmanship.",
    hue: 18, initials: "DC", img: tImg5,
  },
  {
    id: 6, name: "Outdoor Lights", role: "", company: "",
    excerpt: "Exterior Excellence",
    quote: "Weather-resistant elegance. Our outdoor series brings the same level of design sophistication to your exterior spaces, combining durability with premium light quality.",
    hue: 260, initials: "OL", img: tImg6,
  },
];

// ─── Pure-scroll progress hook (identical pattern to WhyChooseUs) ─────────────
// Uses window scroll events only — NO GSAP ScrollTrigger, NO spacer divs.

function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Track horizontal scroll distance (measured once after mount)
  const [trackScroll, setTrackScroll] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setTrackScroll(
        Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 120)
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Section height: viewport + horizontal travel distance
  // This is the same technique WhyChooseUs uses (900vh style) but data-driven.
  const sectionH = `calc(100vh + ${trackScroll}px)`;

  // Scroll progress drives horizontal translation
  const progress = useScrollProgress(containerRef);
  const trackX = -(progress * trackScroll);

  // Revealed-card set — each index added once when it enters the visual viewport
  const revealedRef = useRef(new Set<number>());


  // ── 3D tilt + sheen (mouse events, attached once after trackScroll is known) ──
  useEffect(() => {
    if (trackScroll === 0) return;
    const cards = cardsRef.current.filter(Boolean) as HTMLButtonElement[];
    const CARD_STEP = 412; // 380px card + 32px gap
    const PAD_LEFT  = window.innerWidth * 0.1;

    const handlers: Array<{
      card: HTMLButtonElement;
      enter: () => void;
      leave: () => void;
      move: (e: MouseEvent) => void;
    }> = [];

    cards.forEach((card, i) => {
      // Only hide cards that start fully off-screen to the right.
      const cardLeft = PAD_LEFT + i * CARD_STEP;
      const startsVisible = cardLeft < window.innerWidth;
      if (!startsVisible && !revealedRef.current.has(i)) {
        gsap.set(card, {
          opacity: 0,
          y: 48,
          rotate: i % 2 === 0 ? -4 : 4,
          scale: 0.92,
          transformOrigin: "center bottom",
        });
      }

      const inner = card.querySelector(".card-inner") as HTMLElement | null;
      const sheen = card.querySelector(".card-sheen") as HTMLElement | null;
      if (!inner || !sheen) return;

      const enter = () =>
        gsap.to(inner, { y: -10, rotateX: 6, rotateY: -6, duration: 0.5, ease: "power3.out" });
      const leave = () => {
        gsap.to(inner, { y: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        gsap.to(sheen, { opacity: 0, duration: 0.4 });
      };
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        gsap.to(sheen, {
          opacity: 1,
          background: `radial-gradient(circle at ${x}% ${y}%, hsla(0,0%,100%,0.28), transparent 55%)`,
          duration: 0.3,
        });
      };
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      card.addEventListener("mousemove", move);
      handlers.push({ card, enter, leave, move });
    });

    return () => {
      handlers.forEach(({ card, enter, leave, move }) => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
        card.removeEventListener("mousemove", move);
      });
    };
  }, [trackScroll]);

  // ── Scroll-progress reveal — fires each time progress changes ─────────────
  useEffect(() => {
    if (trackScroll === 0) return;
    const cards = cardsRef.current.filter(Boolean) as HTMLButtonElement[];
    const CARD_STEP = 412;
    const PAD_LEFT  = window.innerWidth * 0.1;
    const curTrackX = -(progress * trackScroll);

    cards.forEach((card, i) => {
      if (revealedRef.current.has(i)) return;
      const cardLeft   = PAD_LEFT + i * CARD_STEP;
      const visualLeft = curTrackX + cardLeft; // pixel position of card's left edge on screen
      // Trigger when the card's left edge is within 80px of the right viewport edge
      if (visualLeft < window.innerWidth - 80) {
        revealedRef.current.add(i);
        gsap.to(card, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "rotate,scale,y",
        });
      }
    });
  }, [progress, trackScroll]);


  const [active, setActive] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayCardRef = useRef<HTMLDivElement>(null);
  const overlayBgRef = useRef<HTMLDivElement>(null);
  const overlayQuoteRef = useRef<HTMLParagraphElement>(null);
  const overlayMetaRef = useRef<HTMLDivElement>(null);
  const overlayMarkRef = useRef<HTMLDivElement>(null);

  // GSAP used ONLY for the overlay FLIP + hover effects — no ScrollTrigger at all.
  useEffect(() => {
    if (active === null) return;
    const cardEl = cardsRef.current[active];
    const overlay = overlayRef.current;
    const overlayCard = overlayCardRef.current;
    if (!cardEl || !overlay || !overlayCard) return;

    const first = cardEl.getBoundingClientRect();
    overlay.style.pointerEvents = "auto";

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(overlayBgRef.current, { autoAlpha: 0 });
    gsap.set(overlayCard, {
      position: "fixed",
      top: first.top,
      left: first.left,
      width: first.width,
      height: first.height,
      borderRadius: 24,
      xPercent: 0,
      yPercent: 0,
    });
    gsap.set(
      [overlayQuoteRef.current, overlayMetaRef.current, overlayMarkRef.current],
      { autoAlpha: 0, y: 30 }
    );

    const tl = gsap.timeline();
    tl.to(overlayBgRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0)
      .to(
        overlayCard,
        {
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          xPercent: -50,
          yPercent: -50,
          width: Math.min(720, window.innerWidth - 48),
          height: Math.min(560, window.innerHeight - 80),
          borderRadius: 32,
          duration: 0.9,
          ease: "expo.inOut",
        },
        0,
      )
      .to(overlayMarkRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.45)
      .to(overlayQuoteRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.55)
      .to(overlayMetaRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.65);

    gsap.to(cardEl, { autoAlpha: 0, duration: 0.2 });
  }, [active]);

  const closeOverlay = () => {
    if (active === null) return;
    const cardEl = cardsRef.current[active];
    const overlay = overlayRef.current;
    const overlayCard = overlayCardRef.current;
    if (!cardEl || !overlay || !overlayCard) return;

    const target = cardEl.getBoundingClientRect();

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(cardEl, { autoAlpha: 1 });
        overlay.style.pointerEvents = "none";
        setActive(null);
      },
    });
    tl.to(
      [overlayQuoteRef.current, overlayMetaRef.current, overlayMarkRef.current],
      { autoAlpha: 0, y: 20, duration: 0.25, ease: "power2.in" },
      0,
    )
      .to(
        overlayCard,
        {
          top: target.top,
          left: target.left,
          xPercent: 0,
          yPercent: 0,
          width: target.width,
          height: target.height,
          borderRadius: 24,
          duration: 0.7,
          ease: "expo.inOut",
        },
        0.1,
      )
      .to(overlayBgRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.3);
  };

  const activeT = active !== null ? TESTIMONIALS[active] : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section style={{ position: "relative", background: "#0E0D0E", color: "#F5F0E8" }}>
      {/* ── Outer scrollable container — height = 100vh + trackScroll ────── */}
      <div ref={containerRef} style={{ height: sectionH, position: "relative" }}>

        {/* ── Sticky stage (same technique as WhyChooseUs) ─────────────── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Header */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "72rem",
              margin: "0 auto",
              padding: "0 1.5rem 2rem",
              width: "100%",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                border: "0.5px solid rgba(201,169,98,0.4)",
                background: "rgba(201,169,98,0.07)",
                fontSize: "0.65rem",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#C9A962",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#C9A962",
                  display: "inline-block",
                }}
              />
              Our Products
            </span>
            <h2
              style={{
                fontFamily: "'Runalto', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#F5F0E8",
                margin: 0,
              }}
            >
              Light Styles to Match Every Space
            </h2>
            {/* Description removed */}
          </div>

          {/* Horizontal card track — driven by scroll progress, NO GSAP pin */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              ref={trackRef}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                paddingLeft: "10vw",
                paddingRight: "10vw",
                willChange: "transform",
                transform: `translateX(${trackX}px)`,
                transition: "transform 0.05s linear",
              }}
            >
              {TESTIMONIALS.map((t, i) => {
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    onClick={() => setActive(i)}
                    style={{
                      flexShrink: 0,
                      cursor: "pointer",
                      textAlign: "left" as const,
                      background: "none",
                      border: "none",
                      padding: 0,
                      width: "clamp(260px, 26vw, 360px)",
                      height: "clamp(340px, 44vh, 440px)",
                      perspective: "1200px",
                      position: "relative",
                    }}
                  >
                    {/* card-inner — 3D tilt target */}
                    <div
                      className="card-inner"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        borderRadius: "1.5rem",
                        border: "0.5px solid rgba(245,240,232,0.1)",
                        backgroundImage: `url(${t.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow:
                          "0 30px 60px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)",
                      }}
                    >
                      {/* Dark scrim for text legibility */}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", borderRadius: "1.5rem", zIndex: 1 }} />
                      {/* Sheen layer */}
                      <div
                        className="card-sheen"
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "1.5rem",
                          zIndex: 5,
                          pointerEvents: "none",
                          opacity: 0,
                        }}
                      />
                      {/* Number */}
                        {/* Counter removed */}

                      {/* Quote mark removed */}

                      {/* Card content */}
                      <div
                        style={{
                          position: "absolute",
                          left: "1.5rem",
                          right: "1.5rem",
                          bottom: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          color: "#F5F0E8",
                          zIndex: 2,
                        }}
                      >
                        {/* Excerpt removed */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            borderTop: "0.5px solid rgba(245,240,232,0.1)",
                            paddingTop: "0.875rem",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <span
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: 500,
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#F5F0E8",
                              }}
                            >
                              {t.name}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "1.75rem",
                              height: "1.75rem",
                              borderRadius: "50%",
                              background: "rgba(245,240,232,0.07)",
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M7 17L17 7M9 7h8v8" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>{/* end card-inner */}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* end sticky stage */}
      </div>
      {/* end outer container */}

      {/* ── Overlay (fixed, z-9999, pure GSAP tweens — no ScrollTrigger) ── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={overlayBgRef}
          onClick={closeOverlay}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)",
          }}
        />
        {activeT && (
          <div
            ref={overlayCardRef}
            style={{
              overflow: "hidden",
              border: "0.5px solid rgba(245,240,232,0.1)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              background: `linear-gradient(155deg, hsl(${activeT.hue}, 28%, 16%) 0%, hsl(${activeT.hue}, 18%, 9%) 100%)`,
            }}
          >
            <button
              onClick={closeOverlay}
              style={{
                position: "absolute",
                right: "1.25rem",
                top: "1.25rem",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "50%",
                background: "rgba(245,240,232,0.1)",
                border: "none",
                cursor: "pointer",
                color: "#F5F0E8",
              }}
              aria-label="Close"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                padding: "2.5rem",
                color: "#F5F0E8",
              }}
            >
              {/* Quote mark removed */}
              <p
                ref={overlayQuoteRef}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {activeT.quote}
              </p>
              <div
                ref={overlayMetaRef}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  borderTop: "0.5px solid rgba(245,240,232,0.1)",
                  paddingTop: "1.25rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.8rem",
                      fontWeight: 600,
                      color: "#F5F0E8",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {activeT.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
