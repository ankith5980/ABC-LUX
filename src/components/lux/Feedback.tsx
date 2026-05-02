import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import TitleReveal from "../ui/TitleReveal";
import "swiper/css";
import "swiper/css/pagination";
import imgAjmal from "@/assets/ajmal-roshan-k.webp";
import imgUmer  from "@/assets/umer-hayat.webp";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG   = "#D3C8B6";   // warm sand
const FG   = "#1A1819";   // near-black
const ACC  = "#C9A962";   // gold accent
const SUB  = "rgba(26,24,25,.6)";   // muted label text
const STAR = "#C9A962";   // star gold

// ─── Data ─────────────────────────────────────────────────────────────────────
interface TestimonialItem {
  initial: string;
  name: string;
  role: string;
  body: string;
  stars: number;
  size: "large" | "medium" | "small";
  position: { top: string; left: string };
  bg: string;
  textColor: string;
  img?: string;  // optional real photo
}

const ITEMS: TestimonialItem[] = [
  {
    initial: "A",
    name: "Ajmal Roshan K",
    role: "Client",
    body: "Found the perfect chandelier for my living room. Great quality, reasonable pricing, and excellent support from the ABC Lights team.",
    stars: 5,
    size: "large",
    position: { top: "50%", left: "50%" },
    bg: "#1A2436", textColor: "#C9A962",
    img: imgAjmal,
  },
  {
    initial: "U",
    name: "Umer Hayat",
    role: "Client",
    body: "Professional service, trendy designs, and quick delivery. ABC Lights made lighting selection easy and enjoyable for our entire office space.",
    stars: 5,
    size: "medium",
    position: { top: "15%", left: "32%" },
    bg: "#4A1525", textColor: "#F5F0E8",
    img: imgUmer,
  },
  {
    initial: "S",
    name: "Suhaila K",
    role: "Client",
    body: "Visited many stores, but ABC Lights stood out. Unique pieces, helpful staff, great value, and amazing overall experience. Truly satisfied with my purchase",
    stars: 5,
    size: "small",
    position: { top: "20%", left: "60%" },
    bg: "#1B3B36", textColor: "#C9A962", // Emerald
  },
  {
    initial: "M",
    name: "Marcus Chen",
    role: "Client",
    body: "Professional, reliable, and creative. The work was delivered beyond expectations.",
    stars: 5,
    size: "medium",
    position: { top: "70%", left: "22%" },
    bg: "#1A1819", textColor: "#C9A962", // Obsidian
  },
  {
    initial: "J",
    name: "James Whitfield",
    role: "Client",
    body: "Brilliant experience throughout. The team communicated clearly and delivered perfectly.",
    stars: 5,
    size: "small",
    position: { top: "65%", left: "72%" },
    bg: "#5A4D41", textColor: "#F5F0E8", // Bronze
  },
];

// Orbiting avatars for background decoration (not center)
const ORBIT_AVATARS = [
  { initial: "A", size: 56, top: "12%",  left: "8%",  bg: "#1A2436", color: "#C9A962" }, // Midnight Navy
  { initial: "M", size: 76, top: "30%",  left: "14%", bg: "#4A1525", color: "#F5F0E8" }, // Deep Burgundy
  { initial: "S", size: 44, top: "68%",  left: "6%",  bg: "#1B3B36", color: "#C9A962" }, // Emerald
  { initial: "J", size: 52, top: "80%",  left: "22%", bg: "#A68A56", color: "#1A1819" }, // Ochre
  { initial: "R", size: 48, top: "10%",  left: "70%", bg: "#3D4044", color: "#F5F0E8" }, // Slate
  { initial: "T", size: 68, top: "18%",  left: "84%", bg: "#3E273A", color: "#C9A962" }, // Plum
  { initial: "K", size: 44, top: "58%",  left: "88%", bg: "#1A1819", color: "#C9A962" }, // Obsidian
  { initial: "L", size: 56, top: "78%",  left: "78%", bg: "#5A4D41", color: "#F5F0E8" }, // Bronze
];

// ─── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < count ? STAR : "rgba(26,24,25,0.1)"}
          stroke={i < count ? STAR : "rgba(26,24,25,0.15)"}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Avatar placeholder ────────────────────────────────────────────────────────
function Avatar({
  initial,
  size,
  bg,
  border,
  fontSize,
  color,
  img,
}: {
  initial: string;
  size: number;
  bg?: string;
  border?: string;
  fontSize?: number;
  color?: string;
  img?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: img ? "transparent" : (bg ?? "rgba(201,169,98,0.12)"),
        border: border ?? "1.5px solid rgba(201,169,98,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize: fontSize ?? size * 0.38,
        color: color ?? FG,
        flexShrink: 0,
        boxShadow: "0 2px 12px rgba(26,24,25,0.06)",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {img ? (
        <img src={img} alt={initial} width={75} height={75} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      ) : (
        initial
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function Feedback() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = ITEMS[activeIdx % ITEMS.length];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "#D3C8B6",
        padding: "80px 20px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Decorative SVG path */}
      <svg
        className="pointer-events-none absolute inset-x-0 z-[1] w-full top-0"
        style={{ aspectRatio: '1440 / 1080', opacity: 0.35 }}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden
      >
        <linearGradient id="feed-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15141500" />
          <stop offset=".5" stopColor="#c07a20" />
          <stop offset="1" stopColor="#15141500" />
        </linearGradient>
        <path
          fill="none"
          stroke="url(#feed-grad)"
          strokeWidth="1.5"
          d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <style>{`
        .ts-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid rgba(26,24,25,0.15);
          background: transparent;
          color: ${FG};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          box-shadow: 0 2px 8px rgba(26,24,25,0.04);
          flex-shrink: 0;
          z-index: 10;
          margin-top: -30px;
        }
        .ts-nav-btn:hover {
          background: ${ACC};
          border-color: ${ACC};
          color: #F5F0E8;
          transform: scale(1.08);
        }

        .ts-swiper { overflow: visible; }
        .ts-swiper .swiper-pagination {
          position: static !important;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 24px !important;
          padding-bottom: 8px !important;
        }
        .ts-swiper .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: rgba(26,24,25,0.20) !important;
          opacity: 1 !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }
        .ts-swiper .swiper-pagination-bullet-active {
          background: ${ACC} !important;
          width: 24px !important;
          border-radius: 4px !important;
          transform: none !important;
        }

        .ts-orbit-avatar {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(26,24,25,0.06);
          pointer-events: none;
        }

        @keyframes ts-float-a {
          0%,100% { transform: translateY(0px) translateX(0px); }
          33%      { transform: translateY(-12px) translateX(5px); }
          66%      { transform: translateY(-5px) translateX(-6px); }
        }
        @keyframes ts-float-b {
          0%,100% { transform: translateY(0px) translateX(0px); }
          33%      { transform: translateY(8px) translateX(-7px); }
          66%      { transform: translateY(-10px) translateX(4px); }
        }
        @keyframes ts-float-c {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-14px) translateX(8px); }
        }
        @keyframes ts-float-d {
          0%,100% { transform: translateY(0px) translateX(0px); }
          40%      { transform: translateY(10px) translateX(-5px); }
          80%      { transform: translateY(-8px) translateX(6px); }
        }

        .ts-orbit-avatar:nth-child(1) { animation: ts-float-a 6.0s ease-in-out infinite; }
        .ts-orbit-avatar:nth-child(2) { animation: ts-float-b 7.2s ease-in-out infinite; animation-delay: -1.5s; }
        .ts-orbit-avatar:nth-child(3) { animation: ts-float-c 5.5s ease-in-out infinite; animation-delay: -3.0s; }
        .ts-orbit-avatar:nth-child(4) { animation: ts-float-d 8.0s ease-in-out infinite; animation-delay: -0.8s; }
        .ts-orbit-avatar:nth-child(5) { animation: ts-float-a 6.8s ease-in-out infinite; animation-delay: -2.2s; }
        .ts-orbit-avatar:nth-child(6) { animation: ts-float-b 5.8s ease-in-out infinite; animation-delay: -4.0s; }
        .ts-orbit-avatar:nth-child(7) { animation: ts-float-c 7.5s ease-in-out infinite; animation-delay: -1.0s; }
        .ts-orbit-avatar:nth-child(8) { animation: ts-float-d 6.3s ease-in-out infinite; animation-delay: -3.5s; }

        .ts-center-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(201,169,98,0.4);
          pointer-events: none;
          animation: ts-spin 22s linear infinite;
        }
        @keyframes ts-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .ts-quote-icon {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 56px;
          line-height: 0.8;
          color: ${ACC};
          opacity: 0.55;
          display: block;
          text-align: center;
          margin-bottom: 10px;
          user-select: none;
        }

        .ts-testimonial-card {
          text-align: center;
          padding: 0 16px 24px;
        }
        .ts-body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 17px;
          line-height: 1.85;
          color: ${SUB};
          max-width: 440px;
          margin: 0 auto 18px;
        }
        .ts-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 19px;
          font-weight: 400;
          color: ${FG};
          margin-bottom: 3px;
        }
      `}</style>

      {/* ── Decorative orbit rings ─────────────────────────────────────── */}
      <div className="ts-center-ring" style={{ width: 320, height: 320, top: "50%", left: "50%", animationDuration: "28s" }} />
      <div className="ts-center-ring" style={{ width: 480, height: 480, top: "50%", left: "50%", animationDuration: "40s", animationDirection: "reverse" }} />

      {/* ── Orbiting avatar decorations ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {ORBIT_AVATARS.map((av, i) => (
          <div
            key={i}
            className="ts-orbit-avatar"
            style={{
              top: av.top,
              left: av.left,
              width: av.size,
              height: av.size,
            }}
          >
            <Avatar initial={av.initial} size={av.size} bg={av.bg} color={av.color} border="1.5px solid rgba(201,169,98,0.3)" />
          </div>
        ))}
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 860,
          margin: "0 auto",
          padding: "80px 40px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span
            style={{
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
              color: FG,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACC, display: "inline-block" }} />
            Testimonials
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: FG,
              margin: "0 0 20px",
            }}
          >
            <TitleReveal text="What" className="inline-block" style={{ color: FG }} />{" "}
            <TitleReveal text="Our Clients" className="inline-block italic" style={{ color: FG }} />{" "}
            <TitleReveal text="Say" className="inline-block" style={{ color: FG }} />
          </h2>

          <div
            style={{
              width: 48,
              height: 2.5,
              background: ACC,
              borderRadius: 2,
              margin: "0 auto",
            }}
          />
        </div>

        {/* Central large avatar */}
        <div
          style={{
            position: "relative",
            marginBottom: 28,
          }}
        >
          {/* Glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              border: `1.5px dashed ${ACC}`,
              opacity: 0.4,
            }}
          />
          <Avatar
            initial={active.initial}
            size={96}
            bg={active.bg}
            color={active.textColor}
            border={`1.5px solid ${ACC}`}
            fontSize={36}
            img={active.img}
          />
        </div>

        {/* Swiper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            maxWidth: 620,
          }}
        >
          {/* Prev */}
          <button
            type="button"
            className="ts-nav-btn"
            aria-label="Previous"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Swiper */}
          <div className="ts-swiper" style={{ flex: 1, minWidth: 0 }}>
            <Swiper
              modules={[Autoplay, Pagination]}
              loop
              speed={550}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ el: ".ts-pagination", clickable: true }}
              onSwiper={(s) => { swiperRef.current = s; }}
              onSlideChange={(s) => setActiveIdx(s.realIndex)}
            >
              {ITEMS.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="ts-testimonial-card">
                    <span className="ts-quote-icon">&ldquo;</span>
                    <p className="ts-body">&ldquo;{item.body}&rdquo;</p>
                    <p className="ts-name">{item.name}</p>
                    <div style={{ marginTop: 8 }}>
                      <Stars count={item.stars} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div className="ts-pagination swiper-pagination" />
            </Swiper>
          </div>

          {/* Next */}
          <button
            type="button"
            className="ts-nav-btn"
            aria-label="Next"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
