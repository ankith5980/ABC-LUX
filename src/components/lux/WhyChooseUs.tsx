import { useState, useEffect, useRef } from "react";
import TitleReveal from "../ui/TitleReveal";


const CARDS = [
  { id: "01", name: "Wide Range",       description: "Explore a wide range of lighting solutions designed for both homes & businesses with style & quality.", accent: "#C9A962" },
  { id: "02", name: "Expert Guidance",  description: "Get professional assistance to select the perfect lighting that enhances your space with style & efficiency.", accent: "#A87C50" },
  { id: "03", name: "Trusted Brands",    description: "We offer high-quality lighting from trusted brands known for innovation, durability, reliability, & excellent performance.", accent: "#8B9E8E" },
  { id: "04", name: "Warranty Assurance", description: "Enjoy worry-free lighting with assured quality, dependable support, and durable solutions for every space.", accent: "#7A8090" },
];

const N = CARDS.length;

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const eio   = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const remap = (t: number, s: number, e: number) => clamp((t - s) / (e - s));
const phase = (raw: number, s: number, e: number) => eio(remap(raw, s, e));

const CW = 320;
const CH = 440;

const ROLES = [
  { y: -80, scale: 0.88, opacity: 0.55, z: 10 },
  { y: -40, scale: 0.94, opacity: 0.75, z: 20 },
  { y:   0, scale: 1.00, opacity: 1.00, z: 30 },
  { y:  50, scale: 0.94, opacity: 0.75, z: 20 },
];

const ROLE_BY_DIFF = [ROLES[2], ROLES[3], ROLES[0], ROLES[1]];

function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

export function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const raw = useScrollProgress(containerRef);

  const splitP    = phase(raw, 0.08, 0.30);
  const textFadeP = phase(raw, 0.08, 0.26);
  const diagP     = phase(raw, 0.38, 0.54);
  const convergeP = phase(raw, 0.48, 0.68);

  const whyPush    = lerp(0, -36, splitP) + lerp(0, -16, textFadeP);
  const choosePush = lerp(0, 36, splitP) + lerp(0, 16, textFadeP);
  const textOpacity = 1 - textFadeP;
  const textScale   = lerp(1, 0.4, textFadeP);

  const INITIAL_SCALE = 0.5;

  const GAP = 12;
  // Use effective card width at initial scale so cards sit close together
  const effectiveCW = CW * INITIAL_SCALE;
  const totalW = N * effectiveCW + (N - 1) * GAP;
  const flatX = [0, 1, 2, 3].map(i => -totalW / 2 + i * (effectiveCW + GAP) + effectiveCW / 2);
  const STEP = 60;
  const stairY = [-1.5 * STEP, -0.5 * STEP, 0.5 * STEP, 1.5 * STEP];

  const deckRaw = remap(raw, 0.68, 1.00);
  const inDeck = deckRaw > 0;
  const deckIndex = Math.min(N - 1, Math.floor(deckRaw * N));

  const panelOp = eio(remap(raw, 0.60, 0.68));
  const heroCard = CARDS[deckIndex];

  const getRoleForCard = (i: number) => {
    const diff = ((i - deckIndex) % N + N) % N;
    return ROLE_BY_DIFF[diff];
  };

  const CONVERGE_TARGETS = [
    ROLE_BY_DIFF[0],
    ROLE_BY_DIFF[1],
    ROLE_BY_DIFF[2],
    ROLE_BY_DIFF[3],
  ];

  // Cards start at INITIAL_SCALE (small) and grow to full deck scale as they converge

  const getCardProps = (i: number) => {
    const appearStarts = [0.08, 0.14, 0.20, 0.26];
    const appearEnds = [0.17, 0.23, 0.29, 0.35];
    const appear = phase(raw, appearStarts[i], appearEnds[i]);

    if (inDeck) {
      const role = getRoleForCard(i);
      return { tx: 0, ty: role.y, scale: role.scale, opacity: role.opacity, zIndex: role.z, useTransition: true };
    }

    const target = CONVERGE_TARGETS[i];
    const preX = flatX[i];
    const preY = lerp(40, 0, appear) + lerp(0, stairY[i], diagP);

    const tx    = lerp(preX, 0, convergeP);
    const ty    = lerp(preY, target.y, convergeP);
    // Scale: starts small (INITIAL_SCALE), grows to full deck role scale as convergeP → 1
    const scale = lerp(INITIAL_SCALE, target.scale, convergeP);
    const op    = lerp(appear * 0.85, target.opacity, convergeP);
    const z     = convergeP > 0.3 ? target.z : (i + 1);

    return { tx, ty, scale, opacity: op, zIndex: z, useTransition: false };
  };

  return (
    <section className="relative" style={{ background: "#D3C8B6", color: "#1A1819" }}>

      {/* Star Mask at the junction with the previous section */}
      
      <style>{`
        .wcu-stage{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .wcu-title-wrapper{position:absolute;display:flex;flex-direction:column;align-items:center;gap:24px;z-index:4;pointer-events:none}
        .wcu-text-row{display:flex;flex-direction:row;align-items:baseline;gap:0.5em}
        .wcu-subtitle{font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#1A1819}
        .wcu-word-container {
          display: block;
          overflow: hidden;
          line-height: 0.88;
        }
        .wcu-word{
          font-family:'Runalto', serif;
          font-size:clamp(72px,12vw,160px);
          font-weight:500;
          letter-spacing:-.045em;
          white-space:nowrap;
          will-change:transform;
          display:inline-block;
          color:#1A1819;
        }
        .wcu-card{position:absolute;left:50%;top:50%;width:${CW}px;height:${CH}px;border-radius:8px;overflow:hidden;will-change:transform,opacity;background:#EDE6D8}
        .wcu-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
        .wcu-card-sheen{position:absolute;inset:0;background:linear-gradient(155deg,rgba(26,24,25,.06) 0%,transparent 55%);pointer-events:none}
        .wcu-card-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:36px 32px;text-align:center;}
        .wcu-card-numeral{font-family:'Playfair Display',Georgia,serif;font-size:13px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;opacity:.45;margin-bottom:24px;}
        .wcu-card-title{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:400;line-height:1.2;letter-spacing:-.01em;margin-bottom:14px;}
        .wcu-card-desc{font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;font-weight:400;line-height:1.6;letter-spacing:.01em;max-width:280px;}
        .wcu-card-bg-numeral{position:absolute;bottom:-32px;right:-16px;font-family:'Inter',system-ui,sans-serif;font-size:240px;font-weight:800;line-height:1;color:#1A1819;opacity:0.04;pointer-events:none;z-index:1;user-select:none;letter-spacing:-0.05em;}
        .wcu-card-line{width:32px;height:1.5px;margin-bottom:20px;opacity:.6;}
        .wcu-label{position:absolute;left:50%;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:400;font-style:italic;letter-spacing:.01em;white-space:nowrap;pointer-events:none;z-index:35;color:#1A1819;transform:translateX(-50%)}
        .wcu-panel-left{position:absolute;left:52px;top:0;bottom:0;width:230px;display:flex;flex-direction:column;justify-content:center;pointer-events:none;z-index:11}
        .wcu-panel-right{position:absolute;right:52px;top:0;bottom:0;width:230px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;pointer-events:none;z-index:11}
        .wcu-eyebrow{font-family:'Cormorant Garamond',Georgia,serif;font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;line-height:1.75;margin-bottom:40px;color:#1A1819}
        .wcu-body{font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;font-weight:400;line-height:1.75;color:#1A1819}
        .wcu-counter-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
        .wcu-counter{font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:400;letter-spacing:-.02em;position:relative;width:76px;height:76px;display:flex;align-items:center;justify-content:center;color:#1A1819}
        .wcu-counter::before{content:'';position:absolute;inset:0;border:.5px solid rgba(26,24,25,.2);border-radius:50%}
        .wcu-cta{font-family:'Cormorant Garamond',Georgia,serif;font-size:10px;font-weight:300;letter-spacing:.22em;text-transform:uppercase;border:.5px solid rgba(26,24,25,.3);padding:13px 20px;display:flex;align-items:center;gap:36px;cursor:pointer;pointer-events:auto;background:transparent;color:#1A1819;transition:background .2s}
        .wcu-cta:hover{background:rgba(26,24,25,.05)}
        .wcu-ticker{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);z-index:30;font-family:'Cormorant Garamond',Georgia,serif;font-size:9px;letter-spacing:.32em;text-transform:uppercase;background:rgba(26,24,25,.07);color:#1A1819;border:.5px solid rgba(26,24,25,.13);padding:4px 14px;white-space:nowrap}
      `}</style>

      <div ref={containerRef} style={{ height: "900vh", position: "relative" }}>
        <div className="wcu-stage">
          {/* Decorative SVG path inside sticky stage */}
          <svg
            className="pointer-events-none absolute inset-x-0 z-[1] w-full top-0"
            style={{ aspectRatio: '1440 / 1080', opacity: 0.25 }}
            viewBox="0 0 1440 1080"
            preserveAspectRatio="none"
            aria-hidden
          >
            <linearGradient id="why-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#15141500" />
              <stop offset=".5" stopColor="#c07a20" />
              <stop offset="1" stopColor="#15141500" />
            </linearGradient>
            <path
              fill="none"
              stroke="url(#why-grad)"
              strokeWidth="1.5"
              d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
              vectorEffect="non-scaling-stroke"
            />
          </svg>          <div className="wcu-title-wrapper">
            <div className="wcu-text-row" style={{ opacity: textOpacity, transform: `scale(${textScale})` }}>
              <span className="wcu-word-container" style={{ transform: `translateX(${whyPush}vw)` }}>
                <TitleReveal 
                  text="Why" 
                  className="wcu-word" 
                  style={{ color: "#1A1819" }}
                />
              </span>
              <span className="wcu-word-container" style={{ transform: `translateX(${choosePush}vw)` }}>
                <TitleReveal 
                  text="Choose Us" 
                  className="wcu-word"
                  style={{ color: "#1A1819" }}
                />
              </span>
            </div>
            <div className="wcu-subtitle" style={{ opacity: textOpacity }}>
              Driven by Excellence, Powered by Trust
            </div>
          </div>

          {CARDS.map((card, i) => {
            const { tx, ty, scale, opacity, zIndex, useTransition } = getCardProps(i);
            return (
              <div
                key={card.id}
                className="wcu-card"
                style={{
                  transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: useTransition ? "all 0.5s cubic-bezier(0.4,0,0.2,1)" : "none",
                  boxShadow: `0 16px 56px rgba(0,0,0,${opacity > 0.9 ? 0.3 : 0.15})`,
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: card.accent, opacity: 0.12 }} />
                <div className="wcu-card-bg-numeral">{card.id}</div>
                <div className="wcu-card-inner" style={{ color: "#1A1819", zIndex: 2 }}>
                  <span className="wcu-card-numeral">— {card.id}</span>
                  <div className="wcu-card-line" style={{ background: card.accent }} />
                  <h3 className="wcu-card-title">{card.name}</h3>
                  <p className="wcu-card-desc">{card.description}</p>
                </div>
                <div className="wcu-card-sheen" />
              </div>
            );
          })}

          <div className="wcu-label" style={{ top: `calc(50% + ${ROLES[3].y + CH / 2 + 18}px)`, opacity: panelOp }}>
            ({heroCard.id})&ensp;{heroCard.name}
          </div>

          <div className="wcu-panel-left" style={{ opacity: panelOp }}>
            <p className="wcu-eyebrow">Lighting as architecture.<br />Crafted for distinction.</p>
            <p className="wcu-body">{heroCard.description}</p>
          </div>
          <div className="wcu-panel-right" style={{ opacity: panelOp }}>
            <p className="wcu-eyebrow" style={{ textAlign: "right" }}>Form meets illumination.<br />Designed to define spaces.</p>
            <div className="wcu-counter-wrap">
              <div className="wcu-counter">{deckIndex + 1}/{N}</div>
              <button type="button" className="wcu-cta">
                <span>Explore Collection</span>
                <span style={{ opacity: 0.35, fontSize: 18 }}>→</span>
              </button>
            </div>
          </div>

          <div className="wcu-ticker" style={{ opacity: panelOp }}>Why Choose Us</div>
        </div>
      </div>
    </section>
  );
}
