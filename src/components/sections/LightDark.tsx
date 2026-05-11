/* =============================================================
   LightDark.tsx — Lighting Experience Interactive Demo
   =============================================================
   Purpose   : Provides an interactive grid allowing users to toggle between light/dark modes to see lamps illuminated.
   Used by   : Home page index.tsx
   Depends on: react, TitleReveal
   Notes     : Contains fallback SVG procedural generation for missing image assets.
   ============================================================= */

import { useState } from "react";
import TitleReveal from "../ui/TitleReveal";
import pendantLight from "@/assets/pendant-light.webp";
import pendantDark  from "@/assets/pendant-dark.webp";
import light01 from "@/assets/image-light-01.webp";
import dark01  from "@/assets/image-dark-01.webp";
import light02 from "@/assets/image-light-02.webp";
import dark02  from "@/assets/image-dark-02.webp";
import light03 from "@/assets/image-light-03.webp";
import dark03  from "@/assets/image-dark-03.webp";

// ─────────────────────────────────────────────
//  REPLACE THESE PATHS WITH YOUR LOCAL IMAGES
//  Put your images in /public/lamps/ or src/assets/lamps/
//  then update the src strings below.
//
//  Each lamp that uses a real image needs TWO versions:
//    lightSrc  → studio/bright photo (lamp off)
//    darkSrc   → glowing/dark photo  (lamp on)
//
//  Lamps without image paths fall back to SVG illustrations.
// ─────────────────────────────────────────────

interface RealLamp {
  kind: "image";
  id: number;
  lightSrc: string; // e.g. "/lamps/pendant-01-light.jpg"
  darkSrc: string;  // e.g. "/lamps/pendant-01-dark.jpg"
  alt: string;
  scale?: number;
}

interface SvgLamp {
  kind: "svg";
  id: number;
  shape: SvgShape;
  color: string;
  glowColor: string;
}

type SvgShape =
  | "cylinder"
  | "angled"
  | "dish"
  | "dome_flat"
  | "capsule"
  | "disc"
  | "ring"
  | "globe"
  | "cone_wide"
  | "hat"
  | "wide_cone"
  | "saucer";

interface EmptyLamp {
  kind: "empty";
  id: number;
}

type Lamp = RealLamp | SvgLamp | EmptyLamp;

// ─────────────────────────────────────────────
//  LAMP DATA
//  Change kind:"svg" → kind:"image" and add
//  lightSrc / darkSrc to use your own photos.
// ─────────────────────────────────────────────

const LAMPS: Lamp[] = [
  { kind: "image", id: 1, lightSrc: light01, darkSrc: dark01, alt: "Modern Fixture 01", scale: 0.85 },
  { kind: "image", id: 2, lightSrc: light02, darkSrc: dark02, alt: "Modern Fixture 02", scale: 0.9 },
  { kind: "image", id: 3, lightSrc: light03, darkSrc: dark03, alt: "Modern Fixture 03" },
  { kind: "image", id: 4, lightSrc: "", darkSrc: "", alt: "Lamp 04" },
  { kind: "image", id: 5, lightSrc: "", darkSrc: "", alt: "Lamp 05" },
  { kind: "image", id: 6, lightSrc: "", darkSrc: "", alt: "Lamp 06" },
  { kind: "image", id: 7, lightSrc: "", darkSrc: "", alt: "Lamp 07" },
  { kind: "image", id: 8, lightSrc: "", darkSrc: "", alt: "Lamp 08" },
  { kind: "empty", id: 9 },
  { kind: "image", id: 10, lightSrc: "", darkSrc: "", alt: "Lamp 10" },
  { kind: "image", id: 11, lightSrc: "", darkSrc: "", alt: "Lamp 11" },
  { kind: "empty", id: 12 },
];

// ─────────────────────────────────────────────
//  SVG SHAPE BUILDERS
// ─────────────────────────────────────────────

/**
 * getSvgBody
 * Generates an SVG path/shape string based on the selected lamp type.
 */
function getSvgBody(shape: SvgShape, color: string): string {
  switch (shape) {
    case "cylinder":
      return `<rect x="34" y="20" width="32" height="36" rx="3" fill="${color}"/>`;
    case "angled":
      return `<rect x="34" y="20" width="32" height="36" rx="3" fill="${color}" transform="rotate(-15 50 38)"/>`;
    case "dish":
      return `<path d="M28 28 Q50 52 72 28 L70 24 Q50 46 30 24 Z" fill="${color}"/><rect x="46" y="20" width="8" height="8" fill="${color}"/>`;
    case "dome_flat":
      return `<ellipse cx="50" cy="42" rx="24" ry="10" fill="${color}"/><path d="M26 42 Q50 62 74 42" fill="${color}" opacity="0.8"/>`;
    case "capsule":
      return `<rect x="37" y="20" width="26" height="40" rx="13" fill="${color}"/>`;
    case "disc":
      return `<ellipse cx="50" cy="45" rx="26" ry="8" fill="${color}"/><rect x="46" y="20" width="8" height="25" fill="${color}"/>`;
    case "ring":
      return `<path d="M26 30 Q50 60 74 30 L70 26 Q50 54 30 26 Z" fill="${color}"/><line x1="50" y1="20" x2="50" y2="30" stroke="${color}" stroke-width="5"/>`;
    case "globe":
      return `<circle cx="50" cy="48" r="22" fill="${color}" opacity="0.9"/><rect x="46" y="20" width="8" height="8" fill="${color}"/>`;
    case "cone_wide":
      return `<path d="M50 20 L20 62 L80 62 Z" fill="${color}"/>`;
    case "hat":
      return `<path d="M50 20 L30 55 L70 55 Z" fill="${color}"/><ellipse cx="50" cy="55" rx="20" ry="5" fill="${color}" opacity="0.6"/>`;
    case "wide_cone":
      return `<path d="M50 18 L16 64 L84 64 Z" fill="${color}"/><ellipse cx="50" cy="64" rx="34" ry="6" fill="${color}" opacity="0.5"/>`;
    case "saucer":
      return `<path d="M24 40 Q50 58 76 40 Q76 30 50 26 Q24 30 24 40Z" fill="${color}"/><rect x="46" y="20" width="8" height="10" fill="${color}"/>`;
  }
}

// ─────────────────────────────────────────────
//  SVG LAMP COMPONENT
// ─────────────────────────────────────────────

/**
 * SvgLampIcon
 * Procedurally generates an SVG representation of a lamp, with glow layers activated if lit.
 * Props:
 * - lamp: SvgLamp data object
 * - lit: Boolean indicating if the lamp is "on"
 */
function SvgLampIcon({ lamp, lit }: { lamp: SvgLamp; lit: boolean }) {
  const cord   = `<line x1="50" y1="0" x2="50" y2="20" stroke="${lit ? "#555" : "#888"}" stroke-width="1.5"/>`;
  const body   = getSvgBody(lamp.shape, lamp.color);
  const g      = lamp.glowColor;
  const bulb   = lit
    ? `<circle cx="50" cy="52" r="7" fill="${g}" opacity="0.95"/>
       <circle cx="50" cy="52" r="12" fill="${g}" opacity="0.25"/>
       <circle cx="50" cy="52" r="20" fill="${g}" opacity="0.1"/>`
    : "";
  const glow   = lit ? `<ellipse cx="50" cy="78" rx="36" ry="14" fill="${g}" opacity="0.15"/>` : "";
  const svg    = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:60%;height:60%">${cord}${body}${bulb}${glow}</svg>`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.8s ease",
        opacity: 1,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ─────────────────────────────────────────────
//  IMAGE PLACEHOLDER COMPONENT
//  Shows a grey box with label when src is empty
// ─────────────────────────────────────────────

/**
 * ImageLayer
 * Renders an image or a placeholder if the source is missing.
 * Props:
 * - src: Image URL
 * - alt: Alt text
 * - visible: Current visibility state for opacity transition
 * - label: Text for the missing-image placeholder
 * - dark: Is this the dark/lit version
 */
function ImageLayer({
  src,
  alt,
  visible,
  label,
  dark,
  scale,
}: {
  src: string;
  alt: string;
  visible: boolean;
  label: string;
  dark: boolean;
  scale?: number;
}) {
  const isEmpty = !src;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transition: "opacity 0.8s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {isEmpty ? (
        // ── Placeholder shown when no image path is set ──
        <div
          style={{
            width: "100%",
            height: "100%",
            background: dark ? "#2a2926" : "#d8d5cf",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {/* Camera icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={dark ? "#666" : "#aaa"}
            strokeWidth="1.5"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.08em",
              color: dark ? "#555" : "#aaa",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={1536}
          height={1536}
          loading="lazy"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: scale ? "contain" : "cover", 
            display: "block",
            transform: scale ? `scale(${scale})` : undefined
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  LAMP CELL COMPONENT
// ─────────────────────────────────────────────

/**
 * LampCell
 * A single grid cell that manages the transition between a light (off) and dark (on) state.
 * Supports both real images and procedural SVG lamps.
 * Props:
 * - lamp: Lamp data object
 * - dark: Global dark mode toggle state
 */
function LampCell({ lamp, dark }: { lamp: RealLamp | SvgLamp; dark: boolean }) {
  const cellBg = dark ? "#1a1918" : "#e8e5e0";

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1",
        overflow: "hidden",
        background: cellBg,
        transition: "background 0.7s ease",
        cursor: "pointer",
      }}
    >
      {lamp.kind === "image" ? (
        <>
          <ImageLayer
            src={lamp.lightSrc}
            alt={lamp.alt}
            visible={!dark}
            label="light photo"
            dark={false}
            scale={lamp.scale}
          />
          <ImageLayer
            src={lamp.darkSrc}
            alt={lamp.alt}
            visible={dark}
            label="dark photo"
            dark={true}
            scale={lamp.scale}
          />
        </>
      ) : (
        <>
          {/* Light SVG (lamp off) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.8s ease",
              opacity: dark ? 0 : 1,
            }}
          >
            <SvgLampIcon lamp={lamp} lit={false} />
          </div>
          {/* Dark SVG (lamp on) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.8s ease",
              opacity: dark ? 1 : 0,
            }}
          >
            <SvgLampIcon lamp={lamp} lit={true} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  TOGGLE BUTTON
// ─────────────────────────────────────────────

/**
 * Toggle
 * A custom switch component to toggle the global light/dark state.
 * Props:
 * - dark: Current state
 * - onToggle: Click handler
 */
function Toggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle dark mode"
      style={{
        position: "relative",
        zIndex: 10,
        width: 44,
        height: 24,
        borderRadius: 12,
        background: "#c07a20",
        border: "none",
        cursor: "pointer",
        transition: "background 0.5s ease",
        padding: 0,
        outline: "none",
      }}
    >
      <span
        style={{
          display: "block",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: dark ? "black" : "white",
          position: "absolute",
          top: 3,
          left: 3,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease",
          transform: dark ? "translateX(20px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────

/**
 * AmberLighting
 * Renders the responsive grid container for the lamp cells.
 * Props:
 * - dark: Global dark mode toggle state
 */
function AmberLighting({ dark }: { dark: boolean }) {
  return (
      <div
        style={{
          background: "transparent",
          transition: "background 0.7s ease",
          minHeight: "100vh",
          position: "relative",
          zIndex: 10,
        }}
      >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
          gap: 12,
          padding: 24,
          maxWidth: '1100px',
          margin: '0 auto',
          background: 'transparent',
        }}
      >
        {LAMPS.map((lamp) => (
          lamp.kind === "empty" ? <div key={lamp.id} /> : <LampCell key={lamp.id} lamp={lamp} dark={dark} />
        ))}
      </div>
    </div>
  );
}

/**
 * LightDark
 * Main exported section component.
 * Wraps the interactive lighting experience with layout styling and the toggle controls.
 * Props: None
 */
export default function LightDark() {
  const [dark, setDark] = useState(false);

  return (
    <section id="products" className="relative" style={{ background: '#D3C8B6', color: '#1A1819' }}>
      {/* Decorative SVG path */}
      <svg
        className="pointer-events-none absolute inset-x-0 z-[1] w-full top-0"
        style={{ aspectRatio: '1440 / 1080', opacity: 0.25 }}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden
      >
        <linearGradient id="prod-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15141500" />
          <stop offset=".5" stopColor="#c07a20" />
          <stop offset="1" stopColor="#15141500" />
        </linearGradient>
        <path
          fill="none"
          stroke="url(#prod-grad)"
          strokeWidth="1.5"
          d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem', background: 'transparent', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 style={{ margin: 0, background: 'transparent' }}>
          <TitleReveal
            text="Lighting Experience"
            className="block"
            waitForPreloader={false}
            style={{ 
              color: '#1A1819', 
              fontFamily: "'Runalto', 'Playfair Display', Georgia, serif", 
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.03em'
            }}
          />
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.125rem',
          color: '#1A1819',
          opacity: 0.8,
          margin: '1.5rem auto 0',
          maxWidth: '500px',
        }}>
          Experience how our pieces transform spaces through the interplay of light and shadow.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Toggle dark={dark} onToggle={() => setDark((d) => !d)} />
        </div>
      </div>
      <AmberLighting dark={dark} />
    </section>
  );
}
