/* =============================================================
   Footer.tsx — Site Footer
   =============================================================
   Purpose   : Renders the global footer containing social links, address, contact, and quick links.
   Used by   : Home page index.tsx (and potentially RootLayout if extracted)
   Depends on: react
   Notes     : Purely static presentation component.
   ============================================================= */

/**
 * Footer
 * Global footer component.
 * Props: None
 */
export function Footer() {
  return (
    <footer id="footer" className="relative w-full overflow-hidden bg-[var(--obsidian)] pt-24">
      <div className="mx-auto max-w-[1400px] px-8 pb-16">
        <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-12 md:grid-cols-4">
          {/* Company Info & Socials */}
          <div className="md:col-span-1">
            <p className="mb-8 text-sm leading-relaxed text-[#F1EBDD]/70 max-w-[300px]">
              We provide energy-efficient LED lighting solutions designed for durability, performance, and sustainability—enhancing spaces while reducing energy costs and environmental impact.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/abclightsqa" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EBDD]/10 text-[#F1EBDD] transition-colors duration-500 ease-out hover:bg-[var(--ember)] hover:text-[var(--obsidian)]" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="https://www.instagram.com/abclightsqa/" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EBDD]/10 text-[#F1EBDD] transition-colors duration-500 ease-out hover:bg-[var(--ember)] hover:text-[var(--obsidian)]" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.01 4.01 0 110-8.019 4.01 4.01 0 010 8.019zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.snapchat.com/@abclightsqa?share_id=4J8U7YbuJ9w&locale=en-IN" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EBDD]/10 text-[#F1EBDD] transition-colors duration-500 ease-out hover:bg-[var(--ember)] hover:text-[var(--obsidian)]" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Snapchat</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.166 3C9.979 3 7.081 4.312 6.768 7.656c-.089.965-.072 1.682-.072 1.682s-.298.148-.639.148c-.372 0-.734-.185-.734-.185s-.188.37.2.643c.38.267.981.354 1.003.849.022.497-1.085 2.647-1.085 2.647s-.21.502.488.77c.698.269.979.13 1.163.491.185.362.13 1.293 1.139 1.293.52 0 1.21-.231 1.877-.231.445 0 .826.115 1.22.463.393.348.743.694 1.506.694.764 0 1.113-.346 1.507-.694.394-.348.774-.463 1.219-.463.668 0 1.357.231 1.877.231 1.009 0 .954-.931 1.139-1.293.184-.361.465-.222 1.163-.491.698-.268.488-.77.488-.77S18.595 11 18.617 10.503c.022-.495.623-.582 1.003-.849.388-.273.2-.643.2-.643s-.362.185-.734.185c-.341 0-.639-.148-.639-.148s.017-.717-.072-1.682C18.062 4.312 14.912 3 12.166 3z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EBDD]/10 text-[#F1EBDD] transition-colors duration-500 ease-out hover:bg-[var(--ember)] hover:text-[var(--obsidian)]" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Tiktok</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3a3.1 3.1 0 00-1.25 1.54 3.13 3.13 0 00.32 2.66c.55.85 1.5 1.39 2.5 1.41.97.05 1.97-.33 2.63-1.03.62-.64.95-1.52.93-2.42V.02z" /></svg>
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="lux-eyebrow mb-6 text-muted-foreground">Address</div>
            <ul className="space-y-2 font-serif text-lg text-[#F1EBDD]">
              <li>Shop No. 5, Zone 43, Street, 340</li>
              <li>Salwa Road, Doha</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="lux-eyebrow mb-6 text-muted-foreground">Contact</div>
            <ul className="space-y-2 font-serif text-lg text-[#F1EBDD]">
              <li>(974) 4468 3471 / 5013 7888</li>
              <li>info@abclights.qa</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="lux-eyebrow mb-6 text-muted-foreground">Quick Links</div>
            <ul className="space-y-2 font-serif text-lg">
              <li><a href="#top" className="hover:text-[var(--ember)] transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-[var(--ember)] transition-colors">About</a></li>
              <li><a href="#products" className="hover:text-[var(--ember)] transition-colors">Products</a></li>
              <li><a href="#brands" className="hover:text-[var(--ember)] transition-colors">Brands</a></li>
              <li><a href="#contact" className="hover:text-[var(--ember)] transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

    </footer>
  );
}
