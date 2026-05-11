/* =============================================================
   About.tsx — About Section
   =============================================================
   Purpose   : Renders the "About Us" section with a clean, grid-based layout and scroll-triggered text reveals.
   Used by   : Home page index.tsx
   Depends on: gsap, ScrollTrigger
   Notes     : Uses a staggered blur-to-focus animation for text elements on scroll.
   ============================================================= */

import { useEffect, useRef } from "react";
import { getAnimationContext } from "@/utils/gsap-setup";
import aboutImg from "@/assets/Abc-Lights-Qatar.webp";

import TitleReveal from "../ui/TitleReveal";

/**
 * About
 * A responsive narrative section introducing the brand's philosophy.
 * Features staggered GSAP animations triggered by scrolling into view.
 * Props: None
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect: Sets up ScrollTrigger to animate text elements when the section enters the viewport
  useEffect(() => {
    const { gsap } = getAnimationContext('about');
    const ctx = gsap.context(() => {
      const reveals = containerRef.current?.querySelectorAll(".reveal-text");
      if (reveals) {
        gsap.fromTo(
          reveals,
          { 
            opacity: 0, 
            y: 40,
            filter: "blur(10px)"
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.5,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="lux-about-section relative min-h-screen flex items-center bg-[#0E0D0E] px-4 md:px-16 md:py-32 lg:px-24 lg:py-40 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] relative z-10 pt-20 md:pt-24 lg:pt-32" ref={containerRef}>
        <div className="lux-about-grid grid grid-cols-1 items-center lg:items-start gap-16 lg:grid-cols-[1.2fr_0.8fr] md:gap-20 lg:gap-32">
          
          {/* Left Column: Narrative Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 md:gap-10 w-full order-1">
            <div className="w-full">
               {/* Pill Badge */}
                <div className="reveal-text inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-5 md:mb-8 mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">About ABC Lights</span>
                </div>

                <h2 
                  className="text-[clamp(26px,7vw,64px)] md:text-[clamp(36px,5vw,72px)] font-medium leading-[1.2] md:leading-[1.1] tracking-[-0.02em] text-[#F5F0E8] mb-6 md:mb-8 mx-auto lg:mx-0 flex flex-col items-center lg:items-start"
                  style={{ fontFamily: "'Runalto', serif" }}
                >
                  <TitleReveal text="Lighting Your Way to" className="justify-center lg:justify-start" waitForPreloader={false} />
                  <div className="flex items-center justify-center lg:justify-start gap-[0.25em] flex-wrap">
                    <TitleReveal text="a" waitForPreloader={false} />
                    <TitleReveal text="Brighter Tomorrow" className="italic text-[#C9A962]" waitForPreloader={false} />
                  </div>
                </h2>
                
                <p className="reveal-text text-[clamp(15px,1.2vw,18px)] leading-relaxed text-[#F5F0E8]/70 max-w-[640px] mx-auto lg:mx-0">
                  ABC Lights, part of ABC Group Qatar, has been serving customers in Qatar since 2018. We offer high-quality, modern lighting solutions at competitive prices. Our products are innovative, stylish, and designed to meet various needs. With a focus on customer satisfaction, we provide full support and assistance, ensuring the best lighting experience for homes and businesses.
                </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full pt-4">
                {/* Mission */}
                <div className="reveal-text flex flex-col gap-4 group">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                            <svg width="20" height="20" className="md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-[#F5F0E8]">Mission</h3>
                    </div>
                    <p className="text-[13px] md:text-sm leading-relaxed text-[#F5F0E8]/50 max-w-[300px] mx-auto lg:mx-0">
                        To provide high-quality, innovative, and affordable lighting solutions that enhance homes and businesses while ensuring customer satisfaction through excellent service and support.
                    </p>
                </div>

                {/* Vision */}
                <div className="reveal-text flex flex-col gap-4 group">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                            <svg width="20" height="20" className="md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-[#F5F0E8]">Vision</h3>
                    </div>
                    <p className="text-[13px] md:text-sm leading-relaxed text-[#F5F0E8]/50 max-w-[300px] mx-auto lg:mx-0">
                        To be Qatar’s leading lighting provider, known for innovation, reliability, and excellence, offering cutting-edge lighting solutions that brighten every space.
                    </p>
                </div>
            </div>
          </div>

          {/* Right Column: Brand Image & Stats */}
          <div className="relative group w-full mt-12 lg:mt-0 flex justify-center lg:justify-end order-2">
            <div className="reveal-text relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] aspect-[4/5] md:aspect-square lg:aspect-[4/5] border border-[#F5F0E8]/10 w-full max-w-[480px]">
                <img 
                    src={aboutImg} 
                    alt="ABC Lights Qatar Showroom" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0E0D0E]/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Stats Overlay — Experience Card */}
            <div className="lux-exp-card reveal-text absolute -bottom-6 md:-bottom-10 lg:-bottom-12 -right-2 md:-right-6 lg:-right-8 bg-[#C9A962] p-5 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] w-[85%] max-w-[260px] md:max-w-[320px] lg:max-w-[360px] border border-white/10">
                <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-10 text-[#0E0D0E]">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight">7+</div>
                        <div className="text-[8px] md:text-[10px] lg:text-[11px] uppercase tracking-widest font-semibold opacity-70 leading-tight">Years of<br/>Experience</div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight">2K+</div>
                        <div className="text-[8px] md:text-[10px] lg:text-[11px] uppercase tracking-widest font-semibold opacity-70 leading-tight">Products</div>
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-[#0E0D0E]/10 pt-3 md:pt-4">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight">12K+</div>
                        <div className="text-[8px] md:text-[10px] lg:text-[11px] uppercase tracking-widest font-semibold opacity-70 leading-tight">Projects Done</div>
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-[#0E0D0E]/10 pt-3 md:pt-4">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight">100K+</div>
                        <div className="text-[8px] md:text-[10px] lg:text-[11px] uppercase tracking-widest font-semibold opacity-70 leading-tight">Happy Customers</div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
