import { useEffect, useRef, useState } from "react";
import { MenuOverlay } from "./MenuOverlay";
import logoUrl from "@/assets/abc-lux-logo.webp";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header ref={ref} className="lux-site-header pointer-events-none fixed inset-x-0 top-0 z-[120] px-6 py-5">
        <div className="lux-nav-inner mx-auto flex w-full max-w-[1600px] items-start justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            data-cursor="HOME"
            aria-label="ABC LUX — Home"
            className="pointer-events-auto inline-flex items-center transition-opacity hover:opacity-80"
            style={{
              filter: scrolled ? "none" : "invert(1)",
            }}
          >
            <img
              src={logoUrl}
              alt="ABC LUX"
              width={600}
              height={180}
              className="lux-logo-img h-60 w-auto select-none object-contain md:h-64 -mt-28 -ml-4 relative z-10"
            />
          </a>

          {/* Center nav */}
          <nav
            className="lux-center-nav pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-6 md:flex"
          >
            <a
              href="#products"
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-[0.1em] backdrop-blur-md transition-all hover:bg-white/20"
            >
              PRODUCTS
            </a>
            <span className="h-10 w-[1px] bg-[#1a1a1a]/60" />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-[0.1em] backdrop-blur-md transition-all hover:bg-white/20"
            >
              BRANDS
            </a>
          </nav>

          {/* Right cluster */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-cursor="OPEN"
              aria-label="Open menu"
              className="lux-menu-btn lux-eyebrow group flex w-[180px] md:w-[220px] items-center justify-between rounded-[10px] border px-4 md:px-6 py-2.5 backdrop-blur-md transition-colors"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: "var(--obsidian)",
                borderColor: "rgba(20,20,20,0.1)",
              }}
            >
              <span className="flex flex-col gap-[4px] w-[24px] items-end">
                <span className="block h-[1.5px] w-[20px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[28px]" />
                <span className="block h-[1.5px] w-[24px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[10px] group-hover:-translate-x-[8px]" />
                <span className="block h-[1.5px] w-[14px] bg-current self-start ml-[4px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[26px]" />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
