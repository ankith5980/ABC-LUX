/* =============================================================
   gsap-setup.ts — GSAP Environment Configuration
   =============================================================
   Purpose   : Standardizes GSAP imports and provides mobile-safe no-op fallbacks.
   Used by   : Almost every animated component and hook.
   Depends on: gsap, ScrollTrigger
   Notes     : To improve mobile performance, GSAP is completely stubbed out (no-op)
               on devices <= 1024px, unless the section is explicitly allowed.
   ============================================================= */

import gsapLib from 'gsap';
import { ScrollTrigger as ScrollTriggerLib } from 'gsap/ScrollTrigger';

import { isMobileOrTablet } from "./device";

const ALLOW_SECTIONS = ['hero', 'about', 'hero-about'];

const noop = () => { };
const noopTicker = { add: noop, remove: noop, lagSmoothing: noop };
const noopTimeline = () => ({ to: noop, from: noop, kill: noop, eventCallback: noop });
const noopGsap = {
	context(cb: any) { try { cb && cb(); } catch (e) { } return { revert: noop }; },
	quickTo() { return noop; },
	set: noop,
	to: noop,
	fromTo: noop,
	from: noop,
	killTweensOf: noop,
	timeline: noopTimeline,
	ticker: noopTicker,
	registerPlugin: noop,
};
const noopScrollTrigger = { config: noop, refresh: noop, update: noop };

// Default exports: for most modules we provide a safe default that is
// real on desktop and no-op on mobile/tablet.
const defaultIsEnabled = !isMobileOrTablet();
let defaultGsap = defaultIsEnabled ? gsapLib : noopGsap;
let defaultScrollTrigger = defaultIsEnabled ? ScrollTriggerLib : noopScrollTrigger;

/**
 * getAnimationContext
 * Dynamically returns either the real GSAP libraries or a set of no-op stubs.
 * @param {string} section - Optional section identifier to force-enable animations.
 * @returns An object containing the appropriate `gsap` and `ScrollTrigger` references.
 */
export function getAnimationContext(section?: string) {
	const enabled = !isMobileOrTablet() || (section ? ALLOW_SECTIONS.includes(section) : false);
	if (enabled) {
		try {
			gsapLib.registerPlugin(ScrollTriggerLib);
		} catch (e) {
			// ignore
		}
		return { gsap: gsapLib, ScrollTrigger: ScrollTriggerLib };
	}
	return { gsap: noopGsap, ScrollTrigger: noopScrollTrigger };
}

/**
 * allowAnimationsFor
 * Determines if animations should run based on the current device and explicit whitelist.
 * @param {string} section - Optional section identifier.
 * @returns {boolean} True if animations should run, false otherwise.
 */
export function allowAnimationsFor(section?: string) {
	return !isMobileOrTablet() || (section ? ALLOW_SECTIONS.includes(section) : false);
}

export { defaultGsap as gsap, defaultScrollTrigger as ScrollTrigger };
export default defaultGsap;
