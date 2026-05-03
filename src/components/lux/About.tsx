import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] items-center justify-center bg-[#0E0D0E] px-6 py-24 md:px-12 md:py-32"
    >
      <div className="relative z-[100] max-w-[1200px] text-center" ref={textRef}>
        <span className="lux-eyebrow mb-6 block text-[10px] uppercase tracking-[0.3em] text-[#F5F0E8] opacity-60 md:text-[12px]">
          Our Legacy
        </span>
        <h2 
          className="mb-8 text-[clamp(32px,6vw,80px)] font-medium leading-[1.1] tracking-[-0.03em] text-[#F5F0E8]"
          style={{ fontFamily: "'Runalto', serif" }}
        >
          Architects of Light, <br /> 
          <span className="opacity-40 italic">Sculptors of Space.</span>
        </h2>
        <div className="mx-auto max-w-[800px]">
          <p className="font-serif text-[clamp(18px,1.8vw,28px)] leading-relaxed text-[#F5F0E8] opacity-80">
            ABC LUX is more than lighting; it is a meticulous study of shadows and brilliance. 
            For over two decades, we have partnered with a private circle of architects 
            to compose bespoke atmospheres where technical precision meets sculptural artistry.
          </p>
        </div>
      </div>
    </section>
  );
}
