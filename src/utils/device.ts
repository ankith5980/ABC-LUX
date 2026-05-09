/* =============================================================
   device.ts — Device Detection Utilities
   =============================================================
   Purpose   : Centralized checks for device capabilities or screen sizes.
   Used by   : useLenis.ts, gsap-setup.ts
   Depends on: window.innerWidth
   Notes     : Simple boolean returns. Should be used defensively.
   ============================================================= */

/**
 * Returns true if the current device is a mobile or tablet
 * based on screen width (≤ 1024px).
 * Single source of truth — used by gsap-setup.ts and useLenis.ts.
 */
export function isMobileOrTablet(): boolean {
  return window.innerWidth <= 1024;
}
