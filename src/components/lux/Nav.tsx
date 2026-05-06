import { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/gsap-setup";
import { MenuOverlay } from "./MenuOverlay";
import logoWhite from "@/assets/ABC-LUX-Logo_White.webp";
import logoBlack from "@/assets/ABC-LUX-Logo_Black.webp";

// Sections that have a dark background — logo should be white here
const DARK_SECTIONS = ["hero-curve", "about", "collections", "contact", "footer"];

// Sections that have a light background — logo should be black here
const LIGHT_SECTIONS = ["top", "our-products", "products", "why-choose-us", "feedback", "blogs"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [logoDark, setLogoDark] = useState(true); // false = use white logo, true = use black logo
  const ref = useRef<HTMLElement | null>(null);

  const logoDarkRef = useRef(true);

  useEffect(() => {
    const sectionMap: Record<string, boolean> = {};
    DARK_SECTIONS.forEach((id) => { sectionMap[id] = false; });
    LIGHT_SECTIONS.forEach((id) => { sectionMap[id] = true; });

    const checkOrder = [
      "top",
      "hero-curve",
      "about",
      "collections",
      "our-products",
      "products",
      "why-choose-us",
      "feedback",
      "blogs",
      "contact",
      "footer",
    ];

    // We check from bottom-most section to top-most. 
    // The first one whose top has crossed the trigger line is the active one.
    const reversedOrder = [...checkOrder].reverse();

    let frameCount = 0;

    const checkLogoColor = () => {
      frameCount++;
      if (frameCount % 4 !== 0) return;

      // Check when a section's top edge reaches the visual center of the logo (~36px from top)
      const triggerY = 36;
      let activeId: string | null = null;

      for (const id of reversedOrder) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            activeId = id;
            break;
          }
        }
      }

      if (activeId !== null) {
        const isDark = sectionMap[activeId];
        if (logoDarkRef.current !== isDark) {
          logoDarkRef.current = isDark;
          setLogoDark(isDark);
        }
      }
    };

    gsap.ticker.add(checkLogoColor);
    window.addEventListener("scroll", checkLogoColor, { passive: true });
    window.addEventListener("resize", checkLogoColor, { passive: true });
    checkLogoColor();

    return () => {
      gsap.ticker.remove(checkLogoColor);
      window.removeEventListener("scroll", checkLogoColor);
      window.removeEventListener("resize", checkLogoColor);
    };
  }, []);

  return (
    <>
      <header
        ref={ref}
        className="lux-site-header pointer-events-none fixed inset-x-0 top-0 z-120 px-6 py-5"
      >
        <div className="lux-nav-inner mx-auto flex w-full max-w-[1600px] items-start justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            data-cursor="HOME"
            aria-label="ABC LUX — Home"
            className="pointer-events-auto inline-flex items-center transition-opacity hover:opacity-80"
          >
            <img
              src={logoDark ? logoBlack : logoWhite}
              alt="ABC LUX"
              width={600}
              height={180}
              className="lux-logo-img h-9 w-auto select-none object-contain md:h-12 relative z-10 -mt-2"
              style={{
                transition: "opacity 0.4s ease",
              }}
            />
          </a>

          {/* Center nav — unchanged from original */}
          <nav className="lux-center-nav pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-6 md:flex">
            <a
              href="#products"
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-widest backdrop-blur-md transition-all hover:bg-white/20"
            >
              PRODUCTS
            </a>
            <span className="h-10 w-px bg-[#1a1a1a]/60" />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-widest backdrop-blur-md transition-all hover:bg-white/20"
            >
              BRANDS
            </a>
          </nav>

          {/* Right cluster — unchanged from original */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-cursor="OPEN"
              aria-label="Open menu"
              className="lux-menu-btn lux-eyebrow group flex w-[160px] md:w-[220px] items-center justify-between rounded-[10px] border px-4 md:px-6 py-2.5 backdrop-blur-md transition-colors pointer-events-auto cursor-pointer relative z-50 shrink-0"
              style={{
                borderColor: logoDark ? "rgba(26,24,25,0.15)" : "rgba(244,238,224,0.15)",
                backgroundColor: logoDark ? "rgba(244,238,224,0.5)" : "rgba(26,24,25,0.2)",
                color: logoDark ? "#1A1819" : "#F4EEE0",
                touchAction: "manipulation",
              }}
            >
              <span className="flex flex-col gap-[4px] w-[24px] items-end pointer-events-none">
                <span className="block h-[1.5px] w-[20px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[28px]" />
                <span className="block h-[1.5px] w-[24px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[10px] group-hover:-translate-x-[8px]" />
                <span className="block h-[1.5px] w-[14px] bg-current self-start ml-[4px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[26px]" />
              </span>
              <span className="pointer-events-none">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
