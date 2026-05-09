/* =============================================================
   Contact.tsx — Admission/Contact Section
   =============================================================
   Purpose   : Renders the contact form and business information section.
   Used by   : Home page index.tsx
   Depends on: react, useMagnetic, TitleReveal
   Notes     : The form is currently visually functional but requires a backend integration for real submissions.
   ============================================================= */

import { useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import TitleReveal from "../ui/TitleReveal";

/**
 * Field
 * A reusable, styled form field component supporting input, textarea, and select.
 * Props:
 * - label: The visible label for the field
 * - name: The form input name attribute
 * - type: HTML input type (default "text")
 * - as: Element type to render (input, textarea, select)
 * - options: Array of option strings if as="select"
 */
function Field({
  label,
  name,
  type = "text",
  as = "input",
  options,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  return (
    <label className="group relative block py-4">
      <span className="lux-eyebrow block text-muted-foreground transition-colors group-focus-within:text-[var(--ember)]">
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={2}
          className="mt-2 w-full resize-none border-0 bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none md:text-3xl"
          placeholder="—"
        />
      ) : as === "select" ? (
        <select
          name={name}
          className="mt-2 w-full appearance-none border-0 bg-transparent font-serif text-2xl text-foreground focus:outline-none md:text-3xl"
        >
          {options?.map((o) => (
            <option key={o} value={o} className="bg-[var(--obsidian)] text-foreground">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          className="mt-2 w-full border-0 bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none md:text-3xl"
          placeholder="—"
        />
      )}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-white/15 transition-transform duration-500"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ember)] transition-transform duration-700 group-focus-within:scale-x-100"
      />
    </label>
  );
}

/**
 * Admission
 * The main contact section providing company details and a contact form.
 * Uses a magnetic button effect for the submit button.
 * Props: None
 */
export function Admission() {
  const submitRef = useMagnetic<HTMLButtonElement>(0.3);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative w-full bg-[var(--obsidian)] py-[18vh]">
      {/* Star divider — same as WhyChooseUs junction, sand colour to match Blogs above */}
      <div className="absolute top-0 left-1/2 z-50 w-24 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#D3C8B6" }}>
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M50,0c0,27.6,22.4,50,50,50-27.6,0-50,22.4-50,50,0-27.6-22.4-50-50-50,27.6,0,50-22.4,50-50Z" />
        </svg>
      </div>
      <div className="mx-auto max-w-[1400px] px-8">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "3rem",
            padding: "0.375rem 1rem",
            borderRadius: "9999px",
            border: "0.5px solid rgba(201,169,98,0.4)",
            background: "rgba(201,169,98,0.07)",
            fontSize: "0.65rem",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C9A962",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A962", display: "inline-block" }} />
          Contact
        </span>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.03em] md:text-[6vw]">
              <TitleReveal text="Feel Free To" className="mr-[0.25em]" />
              <TitleReveal text="Keep" className="mr-[0.35em] whitespace-nowrap" />
              <TitleReveal text="In Touch With Us" className="font-light italic text-[var(--ember)]" />
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Find the perfect lighting solutions tailored to your needs. Get in touch with us for expert advice and premium products.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-[var(--ember)] mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <div className="font-serif text-lg text-foreground">Shop No. 5, Zone 43, Street, 340 Salwa Road, Doha</div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[var(--ember)]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-4.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <div className="font-serif text-lg text-foreground">8:00 AM To 10:00 PM</div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[var(--ember)]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <div className="font-serif text-lg text-foreground">info@abclights.qa</div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[var(--ember)]" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <div className="font-serif text-lg text-foreground">+974 50137888</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="border-y border-white/10 pb-12"
          >
            <Field label="Your Name" name="name" />
            <Field label="Your Email" name="email" type="email" />
            <Field label="Your Phone" name="phone" type="tel" />
            <Field label="Subject" name="subject" />
            <Field label="Message" name="message" as="textarea" />

            <div className="flex items-center justify-between pt-8">
              <p className="lux-eyebrow max-w-xs text-muted-foreground">
                We will get back to you as soon as possible.
              </p>
              <button
                ref={submitRef}
                type="submit"
                data-cursor="SEND"
                disabled={submitted}
                className="lux-eyebrow rounded-full border border-foreground/40 px-8 py-4 text-foreground transition-colors hover:border-[var(--ember)] hover:bg-[var(--ember)] hover:text-[var(--obsidian)] disabled:opacity-60"
              >
                {submitted ? "Sent ✓" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
