import { useState, useEffect, useRef } from "react";
import TitleReveal from "../ui/TitleReveal";
import starMask from "@/assets/star-mask.svg";


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
  const textFadeP = phase(raw, 0.28, 0.46);
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
  const deckIndex = (2 + Math.min(N - 1, Math.floor(deckRaw * N))) % N;

  const panelOp = eio(remap(raw, 0.72, 0.82));
  const heroCard = CARDS[deckIndex];

  const getRoleForCard = (i: number) => {
    const diff = ((i - deckIndex) % N + N) % N;
    return ROLE_BY_DIFF[diff];
  };

  const CONVERGE_TARGETS = [
    ROLE_BY_DIFF[((0 - 2) % N + N) % N],
    ROLE_BY_DIFF[((1 - 2) % N + N) % N],
    ROLE_BY_DIFF[((2 - 2) % N + N) % N],
    ROLE_BY_DIFF[((3 - 2) % N + N) % N],
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
      <div className="absolute top-0 left-1/2 z-50 w-24 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[#0E0D0E]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M50,0c0,27.6,22.4,50,50,50-27.6,0-50,22.4-50,50,0-27.6-22.4-50-50-50,27.6,0,50-22.4,50-50Z" />
        </svg>
      </div>
      <style>{`
        .wcu-stage{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .wcu-text-row{position:absolute;display:flex;flex-direction:row;align-items:baseline;gap:0.5em;pointer-events:none;z-index:4}
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
        .wcu-card-desc{font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;font-weight:300;line-height:1.6;letter-spacing:.01em;opacity:.85;max-width:280px;}
        .wcu-card-line{width:32px;height:1.5px;margin-bottom:20px;opacity:.6;}
        .wcu-label{position:absolute;left:50%;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:400;font-style:italic;letter-spacing:.01em;white-space:nowrap;pointer-events:none;z-index:35;color:#1A1819;transform:translateX(-50%)}
        .wcu-panel-left{position:absolute;left:52px;top:0;bottom:0;width:230px;display:flex;flex-direction:column;justify-content:center;pointer-events:none;z-index:11}
        .wcu-panel-right{position:absolute;right:52px;top:0;bottom:0;width:230px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;pointer-events:none;z-index:11}
        .wcu-eyebrow{font-family:'Cormorant Garamond',Georgia,serif;font-size:10px;font-weight:300;letter-spacing:.22em;text-transform:uppercase;line-height:1.75;margin-bottom:40px;opacity:.75;color:#1A1819}
        .wcu-body{font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;font-weight:300;line-height:1.75;opacity:.65;color:#1A1819}
        .wcu-counter-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
        .wcu-counter{font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:400;letter-spacing:-.02em;opacity:.45;position:relative;width:76px;height:76px;display:flex;align-items:center;justify-content:center;color:#1A1819}
        .wcu-counter::before{content:'';position:absolute;inset:0;border:.5px solid rgba(26,24,25,.2);border-radius:50%}
        .wcu-cta{font-family:'Cormorant Garamond',Georgia,serif;font-size:10px;font-weight:300;letter-spacing:.22em;text-transform:uppercase;border:.5px solid rgba(26,24,25,.3);padding:13px 20px;display:flex;align-items:center;gap:36px;cursor:pointer;pointer-events:auto;background:transparent;color:#1A1819;transition:background .2s}
        .wcu-cta:hover{background:rgba(26,24,25,.05)}
        .wcu-ticker{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);z-index:30;font-family:'Cormorant Garamond',Georgia,serif;font-size:9px;letter-spacing:.32em;text-transform:uppercase;background:rgba(26,24,25,.07);color:#1A1819;border:.5px solid rgba(26,24,25,.13);padding:4px 14px;white-space:nowrap}
        @media(max-width:768px){.wcu-panel-left,.wcu-panel-right{display:none}.wcu-word{font-size:clamp(42px,12vw,72px)}}
      `}</style>

      <div ref={containerRef} style={{ height: "900vh", position: "relative" }}>
        <div className="wcu-stage">

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
                <div className="wcu-card-inner" style={{ color: "#1A1819" }}>
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
            <p className="wcu-eyebrow" style={{ textAlign: "right" }}>Available exclusively<br />by appointment.<br />No two pieces alike.</p>
            <div className="wcu-counter-wrap">
              <div className="wcu-counter">{deckIndex + 1}/{N}</div>
              <button className="wcu-cta">
                <span>Explore Collection</span>
                <span style={{ opacity: 0.35, fontSize: 18 }}>→</span>
              </button>
            </div>
          </div>

          <div className="wcu-ticker" style={{ opacity: Math.max(0.35, panelOp * 0.7) }}>Why Choose Us</div>
        </div>
      </div>
    </section>
  );
}
