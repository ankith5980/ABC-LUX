import gsapLib from 'gsap';
import { ScrollTrigger as ScrollTriggerLib } from 'gsap/ScrollTrigger';

const isClient = typeof window !== 'undefined' && typeof navigator !== 'undefined';
function isMobileOrTablet() {
	if (!isClient) return false;
	try {
		if (window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches)) {
			return true;
		}
	} catch (e) {
		// ignore
	}
	const ua = navigator.userAgent || '';
	return /Mobi|Android|iPhone|iPad|Tablet/.test(ua);
}

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

export function allowAnimationsFor(section?: string) {
	return !isMobileOrTablet() || (section ? ALLOW_SECTIONS.includes(section) : false);
}

export { defaultGsap as gsap, defaultScrollTrigger as ScrollTrigger };
export default defaultGsap;
