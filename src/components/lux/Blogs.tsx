import { useState, useRef } from "react";
import TitleReveal from "../ui/TitleReveal";

import img1 from "@/assets/lux-1.jpg";
import img2 from "@/assets/image-1.jpeg";
import img3 from "@/assets/image-3.jpeg";
import img4 from "@/assets/image-5.jpeg";
import img5 from "@/assets/image-2.jpeg";

// ─── Brand colours (same as WhyChooseUs) ─────────────────────────────────────
const BG   = "#D3C8B6";
const FG   = "#1A1819";
const GOLD = "#C9A962";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  img: string;
  label: string;
  meta: { label: string; value: string };
}

const SLIDES: Slide[] = [
  {
    img: img1,
    label: "A Complete Guide to LED Lighting",
    meta: { label: "Article", value: "Benefits, Types, & Applications" },
  },
  {
    img: img2,
    label: "Outdoor Lighting Essentials",
    meta: { label: "Article", value: "Types, Features, and Installation Tips" },
  },
  {
    img: img3,
    label: "Lighting for Modern Homes",
    meta: { label: "Article", value: "Trends and Smart Solutions" },
  },
  {
    img: img4,
    label: "Interior Accent Lighting",
    meta: { label: "Article", value: "Decorative Tips for Your Space" },
  },
  {
    img: img5,
    label: "Sustainable Lighting",
    meta: { label: "Article", value: "Energy-Efficient Future Solutions" },
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

export function Blogs() {
  const [hovered, setHovered] = useState<CardSlot | null>(null);
  const [cards, setCards] = useState<Record<CardSlot, CardState>>({
    left:   { slideIdx: 0, incomingIdx: null, wipeDir: null, wipeOpen: false },
    center: { slideIdx: 1, incomingIdx: null, wipeDir: null, wipeOpen: false },
    right:  { slideIdx: 2, incomingIdx: null, wipeDir: null, wipeOpen: false },
  });
  const animating = useRef(false);

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
    <section style={{ background: BG, color: FG }}>

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
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.85);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.35s ease, transform 0.35s ease;
          pointer-events: none;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }
        .blg-card:hover .blg-slide-label {
          opacity: 1;
          transform: translateY(0);
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
          width: 58px; height: 58px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,169,98,0.65);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 6;
          transition: opacity 0.35s ease, transform 0.35s ease, border-color 0.2s;
          padding: 0;
        }
        .blg-arrow-btn:hover { border-color: #C9A962; }
        .blg-arrow-btn svg {
          width: 24px; height: 24px;
          stroke: #C9A962;
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
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${FG};
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "90px 60px" }}>

        {/* ── Header (same pattern as the rest of the site) ─────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 32,
          marginBottom: 56,
        }}>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 10,
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "rgba(26,24,25,.55)",
              marginBottom: 14,
            }}>
              Blog & News
            </p>
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
        <div style={{
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
                    className="blg-arrow-btn"
                    style={{
                      left: 10,
                      transform: isHov
                        ? "translateY(-50%) translateX(0)"
                        : "translateY(-50%) translateX(-14px)",
                      opacity: isHov ? 1 : 0,
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
                    className="blg-arrow-btn"
                    style={{
                      right: 10,
                      transform: isHov
                        ? "translateY(-50%) translateX(0)"
                        : "translateY(-50%) translateX(14px)",
                      opacity: isHov ? 1 : 0,
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
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 56,
          marginTop: 20,
        }}>
          {slots.map(({ slot, isCenter }) => {
            const slide = SLIDES[cards[slot].slideIdx];
            return (
              <div
                key={slot}
                style={{
                  width: isCenter ? 540 : 360,
                  flexShrink: 0,
                }}
              >
                <span className="blg-meta-label">{slide.meta.label}</span>
                <span className="blg-meta-value">{slide.meta.value}</span>
              </div>
            );
          })}
        </div>

        {/* ── View all link ────────────────────────────────────────────────── */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 10,
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: FG,
              background: "none",
              border: "none",
              borderBottom: `0.5px solid rgba(26,24,25,.2)`,
              paddingBottom: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "border-color 0.2s",
            }}
          >
            View All Stories <span style={{ fontSize: 14 }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
