import { useEffect, useRef } from "react";
import { getAnimationContext } from "@/utils/gsap-setup";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      ref={sectionRef}      id="about"      className="lux-about-section relative min-h-[60vh] flex items-center bg-[#0E0D0E] px-6 py-20 md:px-16 md:py-32 lg:px-24 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px]" ref={containerRef}>
        <div className="lux-about-grid grid grid-cols-1 items-center lg:items-start gap-12 lg:grid-cols-[1.1fr_1fr] md:gap-20 lg:gap-32">
          
          {/* Left Column: Brand Identity */}
          <div className="lux-about-left flex flex-col items-center text-center lg:items-start lg:text-left gap-6 pt-0 md:pt-44 lg:pt-60 w-full">
            <h2 
              className="lux-about-title reveal-text text-[clamp(36px,5.5vw,85px)] font-medium leading-[1.1] tracking-[-0.03em] text-[#F5F0E8] flex flex-col items-center lg:items-start w-full"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              <span className="block w-full text-center lg:text-left">Get to Know</span>
              <span className="block w-full italic text-[#C9A962] text-center lg:text-left">ABC Lights.</span>
            </h2>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 md:gap-10 md:pt-16 lg:pt-24 w-full">
            <div className="reveal-text h-[1px] w-20 bg-[#C9A962]/30 md:w-24 mx-auto lg:mx-0" />
            
            <div className="space-y-6 md:space-y-8">
              <p className="reveal-text font-serif text-[clamp(18px,2.2vw,30px)] leading-[1.6] text-[#F5F0E8] opacity-90">
                ABC LUX is more than lighting; it is a meticulous study of shadows and brilliance. 
                For over two decades, we have partnered with a private circle of architects 
                to compose bespoke atmospheres where technical precision meets sculptural artistry.
              </p>
              
              <p className="reveal-text text-[clamp(14px,1.2vw,18px)] leading-relaxed text-[#F5F0E8]/60 max-w-[540px] mx-auto lg:mx-0">
                Our approach transcends mere illumination. We see light as a raw material, 
                shaping the narrative of every environment we touch. From minimalist 
                residences to grand architectural statements, we define the essence of luxury.
              </p>
            </div>

            <div className="reveal-text pt-4 md:pt-6 w-full flex justify-center lg:justify-start">
              <div className="inline-flex h-px w-full max-w-[300px] bg-gradient-to-r from-transparent via-[#C9A962]/40 to-transparent lg:from-[#C9A962]/40 lg:via-[#C9A962]/40 lg:to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
