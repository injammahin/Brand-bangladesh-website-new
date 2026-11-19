/**
 * Motion setup (from Demo 1): GSAP + ScrollTrigger, and one Lenis smooth-scroll instance
 * driven by the GSAP ticker so pinned / scrubbed sections stay in sync.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
const raf = (time) => lenis?.raf(time * 1000)

export function initLenis() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, touchMultiplier: 1.5 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  if (import.meta.env.DEV) window.__lenis = lenis // lets automated screenshots scroll precisely
  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(raf)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Current fixed-header height in px (from the --header-h CSS variable) */
export const headerH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64

export const PILLAR_COLORS = [
  { id: 'tourism', color: '#479E90' },
  { id: 'exports', color: '#D9AA66' },
  { id: 'governance', color: '#016171' },
  { id: 'investment', color: '#EF1551' },
  { id: 'culture', color: '#F68421' },
  { id: 'people', color: '#A5CD2F' },
]

export { gsap, ScrollTrigger }
