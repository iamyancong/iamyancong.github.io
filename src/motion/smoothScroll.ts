import type Lenis from 'lenis'
import { ensureGsap } from './gsap'

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null

/** full 档启用 Lenis，并与 ScrollTrigger 共用 GSAP ticker */
export async function enableSmoothScroll() {
  if (lenis || typeof window === 'undefined') return
  const { default: LenisCtor } = await import('lenis')
  const { gsap, ScrollTrigger } = ensureGsap()
  lenis = new LenisCtor({ duration: 1.15, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  document.documentElement.classList.add('lenis')
}

export function disableSmoothScroll() {
  if (!lenis) return
  const { gsap } = ensureGsap()
  if (tick) gsap.ticker.remove(tick)
  gsap.ticker.lagSmoothing(500, 33)
  lenis.destroy()
  lenis = null
  tick = null
  document.documentElement.classList.remove('lenis')
}

/** 平滑滚动到元素或位置；未启用 Lenis 时退回原生滚动 */
export function scrollToTarget(target: string | HTMLElement | number, offset = -72) {
  if (typeof window === 'undefined') return
  if (lenis) {
    lenis.scrollTo(target, { offset })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (typeof el === 'number') {
    window.scrollTo({ top: el, behavior: 'smooth' })
  } else if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }
}
