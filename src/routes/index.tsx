import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";
import { Nav } from "@/components/lux/Nav";
import { Hero } from "@/components/lux/Hero";
import { About } from "@/components/lux/About";
import { Places } from "@/components/lux/Collections";
import { WhyChooseUs } from "@/components/lux/WhyChooseUs";
import { Testimonials } from "@/components/lux/Products";
import LightDark from "@/components/lux/LightDark";
import { Feedback } from "@/components/lux/Feedback";
import { Blogs } from "@/components/lux/Blogs";
import { Admission } from "@/components/lux/Contact";
import { Footer } from "@/components/lux/Footer";
import { useEffect, useState } from "react";
import { getLenis } from "@/hooks/useLenis";
import { gsap, ScrollTrigger } from "@/utils/gsap-setup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABC-LUX" },
      {
        name: "description",
        content:
          "ABC LUX — luxury architectural & decorative lighting. Crystal chandeliers, sculptural pendants, linear systems and bespoke commissions for a private circle of architects and patrons.",
      },
      { property: "og:title", content: "ABC-LUX" },
      {
        property: "og:description",
        content:
          "Luxury architectural lighting, composed as architecture. By appointment only.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  const [ready, setReady] = useState(false);

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
