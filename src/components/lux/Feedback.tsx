import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import TitleReveal from "../ui/TitleReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

import img1 from "@/assets/lux-1.jpg";
import img2 from "@/assets/lux-2.jpg";
import img3 from "@/assets/lux-3.jpg";
import img4 from "@/assets/lux-4.jpg";

import "swiper/css/pagination";

// ─── Brand colours (same as WhyChooseUs) ─────────────────────────────────────
const BG   = "#D3C8B6";   // warm sand
const FG   = "#1A1819";   // near-black
const GOLD = "#C9A962";   // ember / gold accent

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FeedbackItem {
  title: string;
  body: string;
  stars: number;
  avatar: string;
  name: string;
  role: string;
}

const ITEMS: FeedbackItem[] = [
  {
    title: "Perfect Living Room Centerpiece",
    body: "Found the perfect chandelier for my living room. Great quality, reasonable pricing, and excellent support from the ABC Lights team.",
    stars: 5,
    avatar: "A",
    name: "Ajmal Roshan K",
    role: "Verified Client",
  },
  {
    title: "Exceptional Office Lighting",
    body: "Professional service, trendy designs, and quick delivery. ABC Lights made lighting selection easy and enjoyable for our entire office space.",
    stars: 5,
    avatar: "U",
    name: "Umer Hayat",
    role: "Verified Client",
  },
  {
    title: "A Standout Experience",
    body: "Visited many stores, but ABC Lights stood out. Unique pieces, helpful staff, great value, and amazing overall experience. Truly satisfied with my purchase.",
    stars: 5,
    avatar: "S",
    name: "Suhaila K",
    role: "Verified Client",
  },
  {
    title: "The Standard All Others Will Be Measured By",
    body: "We have installed statement lighting in eleven properties. None has generated the response — the spontaneous photography, the direct guest enquiries — that the ABC LUX installation has. The ROI on beauty is real.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "David Nguyen",
    role: "Verified Client",
  },
  {
    title: "Our Brand Came Alive the Day It Arrived",
    body: "Light is the last element most brands consider and the first thing a visitor remembers. After our ABC LUX installation, our showroom became the conversation — not merely the container for one.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Priya Sharma",
    role: "Verified Client",
  },
];

// ─── Star renderer ─────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 20 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? GOLD : "none"}
          stroke={GOLD}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Feedback() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      style={{
        background: BG,
        color: FG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scoped styles — prefixed `fbk-` to avoid any clash */}
      <style>{`
        .fbk-nav-btn {
          position: relative !important;
          flex-shrink: 0;
          width: 46px;
          height: 64px;
          border: 0.5px solid rgba(26,24,25,.22);
          border-radius: 3px;
          background: transparent;
          color: ${FG};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .22s, border-color .22s;
          z-index: 10;
        }
        .fbk-nav-btn:hover { background: rgba(26,24,25,.07); border-color: rgba(26,24,25,.4); }
        .fbk-nav-btn:disabled { opacity: 0.3; cursor: default; }

        /* Swiper pagination bullets — scoped inside .fbk-swiper */
        .fbk-swiper .swiper-pagination {
          position: static !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
          padding-bottom: 0;
        }
        .fbk-swiper .swiper-pagination-bullet {
          width: 7px !important;
          height: 7px !important;
          background: rgba(26,24,25,.25) !important;
          opacity: 1 !important;
          transition: background .3s, transform .3s !important;
          border-radius: 50%;
        }
        .fbk-swiper .swiper-pagination-bullet-active {
          background: ${GOLD} !important;
          transform: scale(1.5) !important;
        }

        /* Quote mark decoration */
        .fbk-quote-mark {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 72px;
          line-height: 0.7;
          color: ${GOLD};
          opacity: 0.45;
          display: block;
          text-align: center;
          margin-bottom: 20px;
          user-select: none;
        }

        /* Slide text */
        .fbk-slide-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(17px, 2vw, 21px);
          font-weight: 700;
          color: ${FG};
          text-align: center;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .fbk-slide-body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.9;
          color: rgba(26,24,25,.6);
          text-align: center;
          max-width: 600px;
          margin: 0 auto 24px;
        }
        .fbk-avatar-ring {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 14px;
        }
        .fbk-avatar-ring::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1.5px solid ${GOLD};
          opacity: 0.45;
        }
        .fbk-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid rgba(26,24,25,.1);
          display: block;
        }
        .fbk-client-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 600;
          font-size: 15px;
          color: ${FG};
          text-align: center;
          margin-bottom: 3px;
        }
        .fbk-client-role {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 11px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: ${GOLD};
          text-align: center;
        }

        /* Decorative corner images */
        .fbk-deco {
          position: absolute;
          pointer-events: none;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          animation: fbk-float 6s ease-in-out infinite;
        }
        @keyframes fbk-float {
          0%, 100% { transform: translate(0, 0) rotate(var(--rot)); }
          50% { transform: translate(0, -15px) rotate(calc(var(--rot) + 2deg)); }
        }
        @media (max-width: 900px) { .fbk-deco { display: none; } }
      `}</style>

      {/* Decorative scattered images */}
      <div
        className="fbk-deco"
        style={{
          left: -8, top: 48,
          width: 170, height: 210,
          backgroundImage: `url(${img1})`,
          "--rot": "-9deg",
          opacity: 0.55,
        } as React.CSSProperties}
      />
      <div
        className="fbk-deco"
        style={{
          left: 44, bottom: 64,
          width: 120, height: 80,
          backgroundImage: `url(${img2})`,
          "--rot": "7deg",
          opacity: 0.4,
        } as React.CSSProperties}
      />
      <div
        className="fbk-deco"
        style={{
          right: -16, top: 16,
          width: 200, height: 140,
          backgroundImage: `url(${img3})`,
          "--rot": "6deg",
          opacity: 0.5,
        } as React.CSSProperties}
      />
      <div
        className="fbk-deco"
        style={{
          right: 24, bottom: 72,
          width: 80, height: 130,
          backgroundImage: `url(${img4})`,
          "--rot": "-5deg",
          opacity: 0.42,
        } as React.CSSProperties}
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1300,
          margin: "0 auto",
          padding: "90px 60px",
        }}
      >
        {/* Header — same style as WhyChooseUs / Blogs */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 10,
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,25,.55)",
              marginBottom: 14,
            }}
          >
            Testimonials
          </p>

          {/* Title uses TitleReveal — identical to WhyChooseUs / Blogs */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: FG,
              margin: "0 0 20px",
            }}
          >
            <TitleReveal text="Reviews" className="inline-block" style={{ color: FG }} />{" "}
            <TitleReveal text="from" className="inline-block italic" style={{ color: FG }} />{" "}
            <TitleReveal text="Clients" className="inline-block" style={{ color: FG }} />
          </h2>

          {/* Gold divider — same ember accent */}
          <div
            style={{
              width: 48,
              height: 2.5,
              background: GOLD,
              borderRadius: 2,
              margin: "0 auto",
            }}
          />
        </div>

        {/* Swiper row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {/* Prev button */}
          <button
            className="fbk-nav-btn"
            aria-label="Previous testimonial"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Swiper */}
          <div
            className="fbk-swiper"
            style={{ flex: 1, maxWidth: 720, minWidth: 0 }}
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              loop
              speed={600}
              autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ el: ".fbk-pagination", clickable: true }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
            >
              {ITEMS.map((item, i) => (
                <SwiperSlide key={i}>
                  <div
                    style={{
                      padding: "10px 24px 28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span className="fbk-quote-mark">&ldquo;</span>
                    <h3 className="fbk-slide-title">{item.title}</h3>
                    <p className="fbk-slide-body">{item.body}</p>
                    <Stars count={item.stars} />
                    <div className="fbk-avatar-ring">
                      {item.avatar.length === 1 ? (
                        <div 
                          className="fbk-avatar" 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            background: GOLD, 
                            color: FG, 
                            fontSize: 24, 
                            fontWeight: 700 
                          }}
                        >
                          {item.avatar}
                        </div>
                      ) : (
                        <img className="fbk-avatar" src={item.avatar} alt={item.name} />
                      )}
                    </div>
                    <p className="fbk-client-name">{item.name}</p>
                    <p className="fbk-client-role">{item.role}</p>
                  </div>
                </SwiperSlide>
              ))}

              {/* Pagination injected here so it's inside the swiper container */}
              <div className="fbk-pagination swiper-pagination" />
            </Swiper>
          </div>

          {/* Next button */}
          <button
            className="fbk-nav-btn"
            aria-label="Next testimonial"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
