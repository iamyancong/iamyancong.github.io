import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

let registered = false

/** 只在客户端注册插件，SSG 阶段不会执行 */
export function ensureGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText)
    registered = true
  }
  return { gsap, ScrollTrigger, SplitText }
}

export { gsap, ScrollTrigger, SplitText }
