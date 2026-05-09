/* =============================================================
   TitleReveal.tsx — Character-by-Character Text Animation
   =============================================================
   Purpose   : Wraps text in an intersection observer to trigger CSS-based staggered character reveals.
   Used by   : Multiple section components (Hero, About, LightDark, WhyChooseUs)
   Depends on: react, usePreloader, IntersectionObserver
   Notes     : Automatically splits text into individual spans and waits for the preloader to finish.
   ============================================================= */

import React, { useEffect, useRef, useState } from 'react';
import { usePreloader } from '@/hooks/usePreloader';

interface TitleRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  once?: boolean;
  waitForPreloader?: boolean;
}

/**
 * TitleReveal
 * Splits a text string into individual characters and uses an IntersectionObserver to apply
 * an "-inview" class, triggering a staggered CSS animation when scrolled into view.
 * Props:
 *   - text (string): The string to animate.
 *   - className (string): Optional classes applied to the outer wrapper.
 *   - style (CSSProperties): Optional inline styles.
 *   - threshold (number): How much of the element must be visible before triggering (0 to 1).
 *   - once (boolean): Whether the animation should only play once.
 *   - waitForPreloader (boolean): Whether to delay animation until the global preloader is done.
 */
const TitleReveal: React.FC<TitleRevealProps> = ({ 
  text, 
  className = '', 
  style, 
  threshold = 0.1,
  once = true,
  waitForPreloader = true
}) => {
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { isLoaded } = usePreloader();

  // Effect: Observes the text wrapper and triggers the in-view state when scrolled into the viewport
  useEffect(() => {
    // Don't start observing until preloader is done (if waitForPreloader is true)
    if (waitForPreloader && !isLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setHasBeenInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once, text, isLoaded, waitForPreloader]); // Re-run if text changes or preloader completes

  // Determine if we should propagate styles to characters (e.g. for gradients)
  const isGradient = style && (style.WebkitBackgroundClip === 'text' || (style as any).backgroundClip === 'text');

  return (
    <span 
      ref={ref}
      className={`title-reveal-splitted ${inView ? '-inview' : ''} ${className}`}
      style={isGradient ? { ...style, backgroundImage: 'none', WebkitBackgroundClip: 'initial', backgroundClip: 'initial' } : style}
      aria-hidden="true"
    >
      {text.split('').map((char, i) => (
        <span
          key={`${text}-${i}`}
          className="-s-char"
          style={{
            ...(isGradient ? {
              backgroundImage: style.backgroundImage,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block' // needed for background-clip in some cases
            } : {}),
            '--char-index': i,
            '--char-random': Math.floor(Math.random() * 10),
          } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default TitleReveal;
