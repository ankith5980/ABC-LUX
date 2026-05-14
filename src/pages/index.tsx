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

  // Effect: Handles scroll restoration when returning to the homepage from a product detail view or blog article
  useEffect(() => {
    const shouldReturnProducts = sessionStorage.getItem("returnToProducts");
    const shouldReturnBlogs = sessionStorage.getItem("returnToBlogs");

    if (shouldReturnProducts || shouldReturnBlogs) {
      // Prioritize the most recent intent
      const targetId = shouldReturnBlogs ? "blogs" : "our-products";
      
      // Clear flags immediately to prevent repeated triggers on refresh
      sessionStorage.removeItem("returnToProducts");
      sessionStorage.removeItem("returnToBlogs");
      
      // Allow components to mount and layout to stabilize
      // 500ms is safer for heavy components like WhyChooseUs
      setTimeout(() => {
        ScrollTrigger.refresh();
        const el = document.getElementById(targetId);
        
        if (el) {
          const lenis = getLenis();
          if (lenis) {
            // Smooth transition as requested
            lenis.scrollTo(el, { 
              duration: 1.8,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        setReady(true);
      }, 500);
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
