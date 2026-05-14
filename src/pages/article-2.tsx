/* =============================================================
   article-2.tsx — Static Article Page
   =============================================================
   Purpose   : Renders a static article about Outdoor Lighting Essentials.
   Used by   : Router (mapped to /article-2)
   Depends on: react-router-dom
   Notes     : Serves as a placeholder template for rich blog content.
   ============================================================= */

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Static color definitions for consistent theming
const BG = "#D3C8B6";
const FG = "#1A1819";
const GOLD = "#C9A962";

/** 
 * ArticleTwo
 * A static marketing/informational article component.
 * Props: None
 */
export default function ArticleTwo() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    sessionStorage.setItem("returnToBlogs", "true");
    navigate("/");
  };

  return (
    <main style={{ background: BG, color: FG, minHeight: "100vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "120px 24px" }}>
        {/* ── Article Label Badge ── */}
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
          textTransform: "uppercase",
          color: GOLD,
        }}>
          Article
        </span>
        {/* ── Article Headline ── */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: 0,
        }}>
          Outdoor Lighting Essentials
        </h1>
        {/* ── Article Subtitle ── */}
        <p style={{
          marginTop: 18,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          color: "rgba(26,24,25,0.75)",
          maxWidth: 720,
        }}>
          Types, Features, and Installation Tips
        </p>
        {/* ── Article Body Excerpt ── */}
        <p style={{
          marginTop: 24,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "rgba(26,24,25,0.75)",
          maxWidth: 800,
        }}>
          A practical guide to exterior lighting choices, durability, and
          placement. This page is ready for your full article content whenever
          you are.
        </p>
        <div style={{ marginTop: 36 }}>
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center rounded-full border px-5 py-2 text-xs uppercase cursor-pointer"
            style={{
              background: "transparent",
              borderColor: "rgba(26,24,25,0.55)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "0.18em",
              color: FG,
              textDecoration: "none",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
