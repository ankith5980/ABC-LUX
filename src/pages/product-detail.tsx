/* =============================================================
   product-detail.tsx — Product Detail Page
   =============================================================
   Purpose   : Displays detailed information and images for a specific product based on route parameters.
   Used by   : Router (mapped to /product/:id)
   Depends on: react-router-dom, GSAP animations, Products constant data
   Notes     : Handles graceful exit animations if JS routing allows.
   ============================================================= */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
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

// Static image catalog array — represents different variants or views of the product
const IMAGES = [
  { src: img1, alt: "Designer Chandelier 1", className: "md:col-span-1 md:row-span-2" },
  { src: img2, alt: "Designer Chandelier 2", className: "md:col-span-1 md:row-span-1" },
  { src: img3, alt: "Designer Chandelier 3", className: "md:col-span-1 md:row-span-1" },
  { src: img4, alt: "Designer Chandelier 4", className: "md:col-span-2 md:row-span-2" },
  { src: img5, alt: "Designer Chandelier 5", className: "md:col-span-1 md:row-span-1" },
  { src: img6, alt: "Designer Chandelier 6", className: "md:col-span-1 md:row-span-2" },
  { src: img7, alt: "Architectural Lights",  className: "md:col-span-1 md:row-span-1" },
  { src: img8, alt: "Modern Pendant Light",  className: "md:col-span-2 md:row-span-1" },
];

/** 
 * ProductDetail
 * Renders the detail view for a specific lighting product, querying the local product catalog by ID.
 * Props: None (uses URL parameters)
 */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const product = TESTIMONIALS.find((p) => p.id === parseInt(id ?? ""));
  const pageTitle = product ? product.name : "Product Not Found";
  const pageDesc = product ? product.quote : "We could not find the details for this specific product.";
  
  // Effect: Resets scroll and orchestrates initial entrance animations for the product page
  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".prod-image", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });
      gsap.from(".prod-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px" }}>
        
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

        {/* 8 Images grid with different dimensions */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          gridAutoRows: "300px",
          gridAutoFlow: "dense"
        }}>
          {IMAGES.map((img, i) => (
            <div 
              key={i} 
              className={`prod-image ${img.className}`}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                }}
              />
            </div>
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
