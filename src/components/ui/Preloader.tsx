/* =============================================================
   Preloader.tsx — Initial Application Loading Screen
   =============================================================
   Purpose   : Displays a staggered curtain reveal animation when the app first mounts.
   Used by   : RootLayout (src/pages/__root.tsx)
   Depends on: react, usePreloader hook
   Notes     : Ensures global loading state is accurately broadcast when the animation finishes.
   ============================================================= */

import { useEffect, useState, useRef } from "react";
import abcLuxLogo from "../../assets/abc-lux-logo.webp";
import { usePreloader } from "../../hooks/usePreloader";

// Static configuration for the preloader animation timing and shape
const BAR_COUNT = 4;
const STAGGER_MS = 120;
const SLIDE_DURATION = "1.1s";
const WAIT_MS = 2000;

interface PreloaderProps {
  children: React.ReactNode;
}

/**
 * Preloader
 * Renders the initial loading overlay with the brand logo and pulsing dots, transitioning
 * into a multi-panel slide-out animation to reveal the content beneath.
 * Props:
 *   - children (React.ReactNode): The application content wrapped by the preloader.
 */
export default function Preloader({ children }: PreloaderProps) {
  const [phase, setPhase] = useState<"splash" | "revealing" | "done">("splash");
  const [barsOut, setBarsOut] = useState<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const { setLoaded } = usePreloader();

  // Effect: Sets up a timeout to automatically dismiss the preloader after WAIT_MS
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    const t = window.setTimeout(startReveal, WAIT_MS);
    timeoutsRef.current.push(t);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Orchestrates the staggered slide-out animation of the preloader panels
  function startReveal() {
    setPhase("revealing");

    for (let i = BAR_COUNT - 1; i >= 0; i--) {
      const reverseIndex = BAR_COUNT - 1 - i;
      const delay = reverseIndex * STAGGER_MS;
      const t = window.setTimeout(() => {
        setBarsOut((prev) => [...prev, i]);
      }, delay);
      timeoutsRef.current.push(t);
    }

    const totalDuration = (BAR_COUNT - 1) * STAGGER_MS + 1200;
    // Signal loaded and remove preloader at same time when fully complete
    const t2 = window.setTimeout(() => {
      setPhase("done");
      setLoaded(); // Signal after bars fully clear
    }, totalDuration);
    timeoutsRef.current.push(t2);
  }

  const isDone = phase === "done";

  return (
    <>
      {/* ── Main Application Content ── */}
      <div className="relative z-0">
        {children}
      </div>

      {!isDone && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
        {/* 4 cream bars - each exactly 25% */}
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const isOut = barsOut.includes(i);
          return (
            <div
              key={i}
              className="absolute left-0 right-0 will-change-transform"
              style={{
                top: `${i * 25}%`,
                height: "25%",
                background: "#f5f0e8",
                transform: isOut ? "translateX(100%)" : "translateX(0)",
                transition: isOut
                  ? `transform ${SLIDE_DURATION} cubic-bezier(0.76, 0, 0.24, 1)`
                  : "none",
              }}
            />
          );
        })}

        {/* Logo - centered over entire overlay */}
        {phase === "splash" && (
          <div className="absolute inset-0 flex items-center justify-center z-[10000] pointer-events-none">
            <img
              src={abcLuxLogo}
              alt="ABC LUX"
              width={1920}
              height={1920}
              className="w-[200px] h-auto select-none opacity-[0.88]"
              style={{
                filter: "invert(1)",
              }}
              draggable={false}
            />
          </div>
        )}

        {/* Pulsing dots */}
        {phase === "splash" && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[10000]">
            <PulseDots />
          </div>
        )}
      </div>
      )}
    </>
  );
}

/**
 * PulseDots
 * A small utility component that animates "..." to indicate active loading.
 * Props: None
 */
function PulseDots() {
  const [tick, setTick] = useState(0);

  // Effect: Increments the dot counter every 600ms
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-[#9a8870] text-sm" style={{ letterSpacing: "6px" }}>
      {"•".repeat((tick % 3) + 1)}
    </span>
  );
}
