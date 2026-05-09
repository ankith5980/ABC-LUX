/* =============================================================
   index.tsx — Main Landing Page
   =============================================================
   Purpose   : Assembles all section components to build the primary homepage of the application.
   Used by   : src/main.tsx (Router)
   Depends on: useLenis, GSAP, and all section components (Hero, About, etc.)
   Notes     : Manages smooth scrolling state and handles return-to-products scroll restoration.
   ============================================================= */

import { useLenis } from "@/hooks/useLenis";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Places } from "@/components/sections/Collections";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Products";
import LightDark from "@/components/sections/LightDark";
import { Feedback } from "@/components/sections/Feedback";
import { Blogs } from "@/components/sections/Blogs";
import { Admission } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { useEffect, useState } from "react";
import { getLenis } from "@/hooks/useLenis";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

/** 
 * Index
 * The home page component that orchestrates all marketing sections. Handles initialization 
 * of smooth scrolling and restoring scroll position if returning from a product detail page.
 * Props: None
 */
export default function Index() {
  // Initialize smooth scrolling for the entire page
  useLenis();
  const [ready, setReady] = useState(false);

  // Effect: Handles scroll restoration when returning to the homepage from a product detail view
  useEffect(() => {
    const shouldReturn = sessionStorage.getItem("returnToProducts");
    if (shouldReturn) {
      sessionStorage.removeItem("returnToProducts");
      
      setTimeout(() => {
        ScrollTrigger.refresh();
        const el = document.getElementById("our-products");
        if (el) {
          const lenis = getLenis();
          if (lenis) {
             lenis.scrollTo(el, { immediate: true });
          } else {
             const forceScroll = () => {
               const y = el.getBoundingClientRect().top + window.pageYOffset;
               window.scrollTo(0, y);
             };
             forceScroll();
             setTimeout(forceScroll, 50);
             setTimeout(forceScroll, 150);
             setTimeout(forceScroll, 400);
          }
        }
        setReady(true);
      }, 150);
    } else {
      setReady(true);
    }
  }, []);

  return (
    <main 
      className="relative bg-obsidian text-foreground transition-opacity duration-300"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Nav />
      <Hero />
      <About />
      <Places />
      <Testimonials />
      <LightDark />
      <WhyChooseUs />
      <Feedback />
      <Blogs />
      <Admission />
      <Footer />
    </main>
  );
}
