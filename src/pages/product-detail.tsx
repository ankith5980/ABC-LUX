/* =============================================================
   product-detail.tsx — Product Detail Page
   =============================================================
   Purpose   : Displays detailed information and images for a specific product based on route parameters.
   Used by   : Router (mapped to /product/:id)
   Depends on: react-router-dom, GSAP animations, Products constant data
   Notes     : Handles graceful exit animations if JS routing allows.
               Images are lazy-loaded and revealed with clipPath wipe animations.
               Layout mirrors the Explore Collections masonry grid.
   ============================================================= */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, allowAnimationsFor } from "@/utils/gsap-setup";
import { TESTIMONIALS } from "@/components/sections/Products";

import img1 from "@/assets/Designer-Chandeliers-1.webp";
import img2 from "@/assets/Designer-Chandeliers-2.webp";
import img3 from "@/assets/Designer-Chandeliers-3.webp";
import img4 from "@/assets/Designer-Chandeliers-4.webp";
import img5 from "@/assets/Designer-Chandeliers-5.webp";
import img6 from "@/assets/Designer-Chandeliers-6.webp";
import img7 from "@/assets/architectural-lights.webp";
import img8 from "@/assets/modern-pendant-light.webp";

// Static color definitions for consistent theming across dynamic products
const BG = "#D3C8B6";
const FG = "#1A1819";
const GOLD = "#C9A962";

// Static image catalog — each tile has a specific grid placement mirroring
// the editorial masonry layout used in the Explore Collections section.
// Grid: 12 columns with varied aspect ratios and offset margins.
const IMAGES = [
  // ── LEFT COLUMN ──
  { src: img1, alt: "Designer Chandelier 1", gridColumn: "1 / 4",   gridRow: "1",     aspect: "3/4",  maxH: "280px",  minH: undefined, mt: "-2vh",  ml: undefined },
  { src: img5, alt: "Designer Chandelier 5", gridColumn: "1 / 4",   gridRow: "2",     aspect: "16/9", maxH: undefined, minH: undefined, mt: "-2vh",  ml: undefined },
  // ── CENTER COLUMN (hero) ──
  { src: img2, alt: "Designer Chandelier 2", gridColumn: "4 / 10",  gridRow: "1 / 3", aspect: "21/9", maxH: undefined, minH: "40vh",   mt: "4vh",   ml: undefined },
  // ── RIGHT COLUMN ──
  { src: img3, alt: "Designer Chandelier 3", gridColumn: "10 / 13", gridRow: "1",     aspect: "4/3",  maxH: undefined, minH: undefined, mt: "-4vh",  ml: undefined },
  { src: img4, alt: "Designer Chandelier 4", gridColumn: "10 / 13", gridRow: "2",     aspect: "16/9", maxH: undefined, minH: "170px",  mt: undefined, ml: undefined },
  // ── BOTTOM ROW ──
  { src: img6, alt: "Designer Chandelier 6", gridColumn: "1 / 5",   gridRow: "3",     aspect: "16/9", maxH: undefined, minH: "140px",  mt: "2vh",   ml: undefined },
  { src: img7, alt: "Architectural Lights",  gridColumn: "5 / 9",   gridRow: "3",     aspect: "4/3",  maxH: undefined, minH: "200px",  mt: "-4vh",  ml: undefined },
  { src: img8, alt: "Modern Pendant Light",  gridColumn: "9 / 13",  gridRow: "3",     aspect: "16/9", maxH: undefined, minH: "220px",  mt: "2vh",   ml: undefined },
];

/* ── Lazy Image Component ───────────────────────────────────────────────────
   Uses native loading="lazy" for browser-level deferred loading.
   Shows a skeleton shimmer until the image has fully decoded.
   ─────────────────────────────────────────────────────────────────────────── */

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Skeleton placeholder — visible until image loads */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "linear-gradient(90deg, rgba(26,24,25,0.06) 25%, rgba(201,169,98,0.08) 50%, rgba(26,24,25,0.06) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s ease-in-out infinite",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease",
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </>
  );
}

/** 
 * ProductDetail
 * Renders the detail view for a specific lighting product, querying the local product catalog by ID.
 * Props: None (uses URL parameters)
 */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const product = TESTIMONIALS.find((p) => p.id === parseInt(id ?? ""));
  const pageTitle = product ? product.name : "Product Not Found";
  const pageDesc = product ? product.quote : "We could not find the details for this specific product.";

  // Callback ref to collect the inner tile wrappers (the ones with aspect-ratio)
  const setTileRef = useCallback((el: HTMLDivElement | null, i: number) => {
    tileRefs.current[i] = el;
  }, []);

  // Effect: Resets scroll and orchestrates initial entrance animations for the product page
  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".prod-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [id]);

  // Effect: IntersectionObserver-driven clipPath reveal on the INNER tile divs.
  // The figure (grid item) stays fully visible so the observer can detect it;
  // the inner div with the image is what gets the clipPath wipe animation.
  useEffect(() => {
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    if (tiles.length === 0) return;

    // Set initial hidden state — clipPath wipe from bottom (same as Collections)
    tiles.forEach((tile) => {
      tile.style.clipPath = "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)";
      tile.style.willChange = "clip-path";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const tile = entry.target as HTMLDivElement;
          const idx = tiles.indexOf(tile);
          const staggerDelay = idx * 120;

          requestAnimationFrame(() => {
            setTimeout(() => {
              tile.style.transition =
                "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
              tile.style.clipPath = "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)";
            }, staggerDelay);
          });

          observer.unobserve(tile);
        });
      },
      {
        rootMargin: "80px 0px -20px 0px",
        threshold: 0.0,
      }
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, [id]);

  const handleBackToProducts = () => {
    const doNavigate = () => {
      sessionStorage.setItem("returnToProducts", "true");
      navigate("/");
    };

    // On mobile/tablet, GSAP is a no-op stub — navigate immediately
    if (!allowAnimationsFor()) {
      doNavigate();
      return;
    }

    // Animate: Exit sequence fading and translating content out before navigation
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: doNavigate,
    });
  };

  return (
    <main style={{ background: BG, color: FG, minHeight: "100vh" }} ref={containerRef}>
      {/* Shimmer keyframe for skeleton placeholders */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .prod-tile-inner:hover img {
          transform: scale(1.05) !important;
        }
        /* Mobile fallback: stack images vertically */
        @media (max-width: 767px) {
          .prod-masonry-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .prod-masonry-grid .prod-image-frame {
            margin: 0 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "120px 24px" }}>
        
        {/* ── Product Label Badge ── */}
        <span className="prod-title" style={{
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
          textTransform: "uppercase",
          color: GOLD,
        }}>
          Product
        </span>
        
        {/* ── Product Name Heading ── */}
        <h1 className="prod-title" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: 0,
        }}>
          {pageTitle}
        </h1>
        
        {/* ── Product Description ── */}
        <p className="prod-title" style={{
          marginTop: 24,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "rgba(26,24,25,0.75)",
          maxWidth: 800,
          marginBottom: 48
        }}>
          {pageDesc}
        </p>

        {/* ── Masonry Image Grid — mirrors Explore Collections layout ── */}
        <div
          className="prod-masonry-grid"
          style={{
            display: "grid",
            width: "100%",
            gap: "clamp(16px, 2vw, 32px)",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto auto auto",
          }}
        >
          {IMAGES.map((img, i) => (
            <figure
              key={i}
              className="prod-image-frame"
              style={{
                position: "relative",
                zIndex: 10,
                margin: 0,
                gridColumn: img.gridColumn,
                gridRow: img.gridRow,
                marginTop: img.mt || undefined,
                marginLeft: img.ml || undefined,
              }}
            >
              {/* Inner tile — this gets the clipPath reveal animation */}
              <div
                ref={(el) => setTileRef(el, i)}
                className="prod-tile-inner"
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "0.5rem",
                  aspectRatio: img.aspect,
                  ...(img.maxH ? { maxHeight: img.maxH } : {}),
                  ...(img.minH ? { minHeight: img.minH } : {}),
                }}
              >
                <LazyImage src={img.src} alt={img.alt} />

                {/* Subtle inner border for premium frame effect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: "1px solid rgba(245,240,232,0.08)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </div>
            </figure>
          ))}
        </div>

        {/* ── Back Navigation Button ── */}
        <div className="prod-title" style={{ marginTop: 60, textAlign: "center" }}>
          <button
            onClick={handleBackToProducts}
            className="inline-flex items-center justify-center rounded-full border px-8 py-3 text-sm uppercase transition-all duration-300 text-[#1A1819] hover:bg-[#1A1819] hover:text-[#D3C8B6]"
            style={{
              borderColor: "rgba(26,24,25,0.55)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "0.18em",
            }}
          >
            Back to Products
          </button>
        </div>
        
      </div>
    </main>
  );
}
