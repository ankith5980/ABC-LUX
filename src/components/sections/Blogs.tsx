/* =============================================================
   Blogs.tsx — Blog & News Carousel Section
   =============================================================
   Purpose   : Displays a custom 3-card sliding carousel for articles with clip-path wipe animations.
   Used by   : Home page index.tsx
   Depends on: react, react-router-dom, TitleReveal
   Notes     : Uses a custom React-state-based carousel rather than a third-party library to allow
               for the specific inset clip-path wipe effect.
   ============================================================= */

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import TitleReveal from "../ui/TitleReveal";

import img1 from "@/assets/Abc-Lights-Qatar.webp";
import img2 from "@/assets/Outdoor-Lights-in-Qatar.webp";
import img3 from "@/assets/modern-lights-in-qatar.webp";

// ─── Brand colours (same as WhyChooseUs) ─────────────────────────────────────
const BG   = "#D3C8B6";
const FG   = "#1A1819";
const GOLD = "#C9A962";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  img: string;
  label: string;
  href: string;
  meta: { label: string; value: string };
}

const SLIDES: Slide[] = [
  {
    img: img1,
    label: "A Complete Guide to LED Lighting: Benefits, Types, & Applications",
    href: "/article-1",
    meta: { label: "Article", value: "Benefits, Types, & Applications" },
  },
  {
    img: img2,
    label: "Outdoor Lighting Essentials: Types, Features, and Installation Tips",
    href: "/article-2",
    meta: { label: "Article", value: "Types, Features, and Installation Tips" },
  },
  {
    img: img3,
    label: "Lighting for Modern Homes: Trends and Smart Solutions",
    href: "/article-3",
    meta: { label: "Article", value: "Trends and Smart Solutions" },
  },
];

type CardSlot = "left" | "center" | "right";

interface CardState {
  slideIdx: number;
  incomingIdx: number | null;
  wipeDir: "ltr" | "rtl" | null;
  wipeOpen: boolean;
}

const ANIM_MS = 750;
const N = SLIDES.length;

const tintGradient: Record<CardSlot, string> = {
  left:   "linear-gradient(to right,  rgba(26,24,25,0.22) 0%, transparent 60%)",
  right:  "linear-gradient(to left,   rgba(26,24,25,0.22) 0%, transparent 60%)",
  center: "transparent",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Blogs
 * Renders the Blog/News section with a dynamic, state-driven 3-card carousel.
 * The carousel uses CSS clip-path transitions for a smooth "wipe" effect between slides.
 * Props: None
 */
export function Blogs() {
  const [hovered, setHovered] = useState<CardSlot | null>(null);
  const [cards, setCards] = useState<Record<CardSlot, CardState>>({
    left:   { slideIdx: 0, incomingIdx: null, wipeDir: null, wipeOpen: false },
    center: { slideIdx: 1, incomingIdx: null, wipeDir: null, wipeOpen: false },
    right:  { slideIdx: 2, incomingIdx: null, wipeDir: null, wipeOpen: false },
  });
  const animating = useRef(false);

  // Handles navigation logic and triggers the multi-step CSS wipe animation sequence
  const navigate = (direction: "left" | "right") => {
    if (animating.current) return;
    animating.current = true;

    const delta    = direction === "right" ? 1 : -1;
    const wipeDir: "ltr" | "rtl" = direction === "right" ? "rtl" : "ltr";
    const slots: CardSlot[] = ["left", "center", "right"];

    setCards(prev => {
      const next = { ...prev };
      slots.forEach(slot => {
        const incoming = (prev[slot].slideIdx + delta + N) % N;
        next[slot] = { ...prev[slot], incomingIdx: incoming, wipeDir, wipeOpen: false };
      });
      return next;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCards(prev => {
          const next = { ...prev };
          slots.forEach(slot => { next[slot] = { ...prev[slot], wipeOpen: true }; });
          return next;
        });

        setTimeout(() => {
          setCards(prev => {
            const next = { ...prev };
            slots.forEach(slot => {
              next[slot] = {
                slideIdx: prev[slot].incomingIdx!,
                incomingIdx: null,
                wipeDir: null,
                wipeOpen: false,
              };
            });
            return next;
          });
          animating.current = false;
        }, ANIM_MS + 50);
      });
    });
  };

  // Calculates the correct CSS clip-path string based on the current animation state
  const getClipPath = (card: CardState) => {
    if (card.incomingIdx === null) return undefined;
    const closed =
      card.wipeDir === "ltr"
        ? "inset(0 100% 0 0 round 12px)"
        : "inset(0 0 0 100% round 12px)";
    return card.wipeOpen ? "inset(0 0% 0 0% round 12px)" : closed;
  };

  const slots: { slot: CardSlot; isCenter: boolean }[] = [
    { slot: "left",   isCenter: false },
    { slot: "center", isCenter: true  },
    { slot: "right",  isCenter: false },
  ];

  return (
    <section id="blogs" style={{ background: BG, color: FG, position: "relative" }}>
      {/* Decorative SVG path */}
      <svg
        className="pointer-events-none absolute inset-x-0 z-[1] w-full top-0"
        style={{ aspectRatio: '1440 / 1080', opacity: 0.35 }}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden
      >
        <linearGradient id="blogs-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15141500" />
          <stop offset=".5" stopColor="#c07a20" />
          <stop offset="1" stopColor="#15141500" />
        </linearGradient>
        <path
          fill="none"
          stroke="url(#blogs-grad)"
          strokeWidth="1.5"
          d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Scoped styles — prefix blg- to avoid clashes */}
      <style>{`
        .blg-card {
          position: relative;
          border-radius: 12px;
          flex-shrink: 0;
          overflow: hidden;
          cursor: pointer;
        }
        .blg-card-side   { width: 360px; height: 240px; }
        .blg-card-center { width: 540px; height: 360px; }

        .blg-layer {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
        }
        .blg-layer-thumb    { z-index: 1; }
        .blg-layer-incoming {
          z-index: 2;
          transition: clip-path ${ANIM_MS}ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        /* Slide label */
        .blg-slide-label {
          position: absolute;
          bottom: 12px;
          left: 14px;
          z-index: 5;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.85);
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
          width: calc(100% - 28px);
          white-space: normal;
          line-height: 1.35;
        }

        /* Dark bottom gradient for label legibility */
        .blg-label-grad {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60%;
          border-radius: 0 0 12px 12px;
          background: linear-gradient(to top, rgba(14,13,14,0.55), transparent);
          z-index: 4;
          pointer-events: none;
        }

        /* Nav arrow */
        .blg-arrow-btn {
          position: absolute;
          top: 50%;
          width: 54px; height: 54px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,169,98,0.85);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 6;
          transition: opacity 0.35s ease, transform 0.35s ease, border-color 0.2s;
          padding: 0;
        }
        .blg-arrow-btn:hover { border-color: #C9A962; }
        .blg-arrow-btn svg {
          width: 22px; height: 22px;
          stroke: rgba(201,169,98,0.95);
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round; stroke-linejoin: round;
          pointer-events: none;
        }

        /* Meta labels */
        .blg-meta-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(26,24,25,.5);
          display: block;
          margin-bottom: 4px;
        }
        .blg-meta-value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${FG};
          display: block;
        }
        .blg-read-more {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1px solid rgba(26,24,25,0.55);
          background: transparent;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${FG};
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .blg-read-more:hover {
          border-color: ${GOLD};
          color: ${GOLD};
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "90px 60px", position: "relative", zIndex: 10 }}>

        {/* ── Header (same pattern as the rest of the site) ─────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          marginBottom: 56,
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{
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
              color: FG,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
              Blog & News
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: FG,
              margin: 0,
            }}>
              <TitleReveal text="Latest" className="inline-block" style={{ color: FG }} />{" "}
              <TitleReveal text="Insights" className="inline-block italic" style={{ color: FG }} />
            </h2>
          </div>

          {/* Gold rule divider */}
          <div style={{ width: 48, height: 2, background: GOLD, borderRadius: 2 }} />
        </div>

        {/* ── Gallery row ───────────────────────────────────────────────── */}
        <div className="blg-gallery-row" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
        }}>
          {slots.map(({ slot, isCenter }) => {
            const card          = cards[slot];
            const currentSlide  = SLIDES[card.slideIdx];
            const incomingSlide = card.incomingIdx !== null ? SLIDES[card.incomingIdx] : null;
            const isHov         = hovered === slot;

            return (
              <div
                key={slot}
                className={`blg-card ${isCenter ? "blg-card-center" : "blg-card-side"}`}
                onMouseEnter={() => setHovered(slot)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Current slide */}
                <div
                  className="blg-layer blg-layer-thumb"
                  style={{ backgroundImage: `url(${currentSlide.img})` }}
                />

                {/* Incoming slide (wipe animation) */}
                {incomingSlide && (
                  <div
                    className="blg-layer blg-layer-incoming"
                    style={{
                      backgroundImage: `url(${incomingSlide.img})`,
                      clipPath: getClipPath(card),
                    }}
                  />
                )}

                {/* Bottom gradient for label readability */}
                <div className="blg-label-grad" />

                {/* Slide label (appears on hover) */}
                <span className="blg-slide-label">{currentSlide.label}</span>

                {/* Uniform dark overlay on hover */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    zIndex: 3,
                    pointerEvents: "none",
                    background: isHov ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0)",
                    transition: "background 0.4s ease",
                  }}
                />

                {/* Side gradient tint on hover */}
                {!isCenter && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      zIndex: 4,
                      pointerEvents: "none",
                      background: tintGradient[slot],
                      opacity: isHov ? 1 : 0,
                      transition: "opacity 0.4s ease",
                    }}
                  />
                )}

                {/* Left arrow (on left card) */}
                {slot === "left" && (
                  <button
                    type="button"
                    className="blg-arrow-btn"
                    style={{
                      left: 10,
                      transform: "translateY(-50%) translateX(0)",
                      opacity: 1,
                    }}
                    onClick={() => navigate("left")}
                    aria-label="Previous"
                  >
                    <svg viewBox="0 0 24 24">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                {/* Right arrow (on right card) */}
                {slot === "right" && (
                  <button
                    type="button"
                    className="blg-arrow-btn"
                    style={{
                      right: 10,
                      transform: "translateY(-50%) translateX(0)",
                      opacity: 1,
                    }}
                    onClick={() => navigate("right")}
                    aria-label="Next"
                  >
                    <svg viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Meta labels row ─────────────────────────────────────────────── */}
        <div className="blg-meta-row" style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 56,
          marginTop: 20,
        }}>
          {slots.map(({ slot, isCenter }) => {
            const slide = SLIDES[cards[slot].slideIdx];
            const parts = slide.label.split(":");
            return (
              <div
                key={slot}
                className={`blg-meta-item ${isCenter ? "blg-meta-item-center" : "blg-meta-item-side"}`}
                style={{
                  width: isCenter ? 540 : 360,
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                <span className="blg-meta-label">{slide.meta.label}</span>
                <span className="blg-meta-value">
                  {parts[0]}:<br />
                  {parts[1]}
                </span>
                <Link className="blg-read-more" to={slide.href}>
                  Read More
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
