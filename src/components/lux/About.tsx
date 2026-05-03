import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      className="relative min-h-[70vh] flex items-center bg-[#0E0D0E] px-6 py-24 md:px-16 md:py-40 lg:px-24"
    >
      <div className="mx-auto w-full max-w-[1400px]" ref={containerRef}>
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20 lg:gap-32">
          
          {/* Left Column: Brand Identity */}
          <div className="flex flex-col gap-6 pt-20 md:pt-40">
            <h2 
              className="reveal-text text-[clamp(40px,5vw,85px)] font-medium leading-[1.05] tracking-[-0.03em] text-[#F5F0E8]"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              Get to Know <br /> 
              <span className="opacity-40 italic">ABC Lights.</span>
            </h2>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="flex flex-col gap-10 pt-4 md:pt-16 lg:pt-24">
            <div className="reveal-text h-[1px] w-24 bg-[#C9A962]/30" />
            
            <div className="space-y-8">
              <p className="reveal-text font-serif text-[clamp(20px,2vw,30px)] leading-[1.5] text-[#F5F0E8] opacity-90">
                ABC LUX is more than lighting; it is a meticulous study of shadows and brilliance. 
                For over two decades, we have partnered with a private circle of architects 
                to compose bespoke atmospheres where technical precision meets sculptural artistry.
              </p>
              
              <p className="reveal-text text-[clamp(15px,1.1vw,18px)] leading-relaxed text-[#F5F0E8]/60 max-w-[500px]">
                Our approach transcends mere illumination. We see light as a raw material, 
                shaping the narrative of every environment we touch. From minimalist 
                residences to grand architectural statements, we define the essence of luxury.
              </p>
            </div>

            <div className="reveal-text pt-6">
              <div className="inline-flex h-px w-full bg-gradient-to-r from-[#C9A962]/40 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
