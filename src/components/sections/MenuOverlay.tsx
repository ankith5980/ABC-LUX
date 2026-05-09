/* =============================================================
   MenuOverlay.tsx — Fullscreen Navigation Overlay
   =============================================================
   Purpose   : Renders the full-screen menu overlay triggered by the global navigation toggle.
   Used by   : Nav.tsx
   Depends on: react, gsap
   Notes     : Employs a complex GSAP timeline to orchestrate a scattered constellation of navigation links.
   ============================================================= */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import logoUrl from "@/assets/abc-lux-logo.webp";

const ITEMS = [
  { label: "Home", href: "#top", pos: { left: "35%", top: "15%" } },
  { label: "About", href: "#about", pos: { left: "22%", top: "44%" } },
  { label: "Brands", href: "#", pos: { left: "64%", top: "44%" } },
  { label: "Contact", href: "#contact", pos: { left: "76%", top: "68%" } },
  { label: "Products", href: "#our-products", pos: { left: "28%", top: "68%" } },
  { label: "Blog", href: "#blogs", pos: { left: "52%", top: "92%" } },
];

/**
 * MenuOverlay
 * The full-screen navigation modal.
 * Uses GSAP context to cleanly manage open/close animation sequences and prevent memory leaks.
 * Props:
 * - open: Boolean controlling visibility
 * - onClose: Function to trigger the closing sequence
 */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!root.current) return;
    
    // Create the context once and scope it to the root element
    ctx.current = gsap.context(() => {}, root);
    
    return () => {
      ctx.current?.revert();
    };
  }, []);

  useEffect(() => {
    if (!ctx.current || !root.current) return;

    ctx.current.add(() => {
      if (open) {
        gsap.killTweensOf([".lux-menu-scrim", ".lux-menu-item", ".lux-menu-meta", root.current]);
        gsap.set(root.current, { display: "block", opacity: 1 });

        gsap.fromTo(
          ".lux-menu-scrim",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(
          ".lux-menu-item",
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.05,
            delay: 0.2,
          }
        );
        gsap.fromTo(
          ".lux-menu-meta",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: "power2.out" }
        );
      } else {
        gsap.killTweensOf([".lux-menu-scrim", ".lux-menu-item", ".lux-menu-meta", root.current]);

        // Fast exit animations
        gsap.to(".lux-menu-item", {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.2,
          ease: "power2.in",
          stagger: 0.02,
        });
        gsap.to(".lux-menu-meta", {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: "power2.in"
        });

        // Fade out the entire container quickly to prevent ghosting of logos or cross icons
        gsap.to(root.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(root.current, { display: "none" });
          },
        });
      }
    });
  }, [open]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-150 hidden"
      aria-hidden={!open}
    >
      {/* Background with radial gradient mimicking the spotlight/marble look */}
      <div
        className="lux-menu-scrim absolute inset-0 bg-[#423329]"
        onClick={onClose}
      >
        {/* Dark radial center */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,15,1)_0%,rgba(20,20,20,0.95)_30%,rgba(0,0,0,0)_70%)]"
        />
        {/* Subtle noise/texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay lux-grain" />
      </div>

      <div className="relative z-10 h-full w-full px-6 py-6 md:px-12 md:py-8">

        {/* Top Header Row */}
        <div className="flex items-start justify-end">
          {/* Brand Logo inside Absolute Container */}
          <div className="lux-menu-logo-wrap absolute left-6 -top-12 z-20 pointer-events-none">
            <img
              src={logoUrl}
              alt="ABC LUX"
              width={1920}
              height={1920}
              loading="lazy"
              className="lux-menu-logo h-48 w-auto object-contain brightness-0 invert opacity-90"
            />
          </div>


          {/* Thin Cross Icon */}
          <button
            type="button"
            onClick={onClose}
            data-cursor="CLOSE"
            className="lux-close-btn relative h-24 w-24 group transition-transform hover:scale-105"
            aria-label="Close menu"
          >
            <span
              className={`cross-line-1 absolute left-1/2 top-1/2 h-px w-20 bg-white/80 origin-center ${open ? 'open' : 'closed'}`}
            />
            <span
              className={`cross-line-2 absolute left-1/2 top-1/2 h-px w-20 bg-white/80 origin-center ${open ? 'open' : 'closed'}`}
            />
          </button>
        </div>

        {/* Scattered Menu Links */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* This wrapper acts as the single bounding box for the whole group. You can add margins or transforms to this div to move the entire constellation at once. */}
          <div className="lux-menu-item-wrapper relative w-full max-w-[1000px] h-[500px] pointer-events-auto mt-12 md:mt-0 translate-x-8 md:translate-x-16">
            {ITEMS.map((it) => (
              <div
                key={it.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: it.pos.left, top: it.pos.top }}
              >
                <a
                  href={it.href}
                  onClick={onClose}
                  data-cursor="ENTER"
                  className="lux-menu-item lux-rollup text-[8vw] leading-none tracking-tight text-white transition-opacity hover:opacity-80 md:text-[5vw]"
                  style={{ fontFamily: "'Runalto', serif" }}
                >
                  <span className="lux-rollup-text" data-text={it.label}>
                    {it.label}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact/Meta Info at bottom right to balance the close pill */}
        <div className="lux-menu-meta absolute bottom-12 right-12 hidden text-right md:block">
          <div className="mb-4">
            <p className="lux-eyebrow text-[10px] uppercase tracking-widest text-white/40">Direct Line</p>
            <a href="tel:+97450137888" className="font-serif mt-1 block text-base text-white/80 transition-colors hover:text-white">
              +974 5013 7888
            </a>
          </div>
          <div>
            <p className="lux-eyebrow text-[10px] uppercase tracking-widest text-white/40">General Inquiries</p>
            <a href="mailto:info@abclights.qa" className="font-serif mt-1 block text-base text-white/80 transition-colors hover:text-white">
              info@abclights.qa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
