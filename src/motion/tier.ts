import { inject, onBeforeUnmount, onMounted, provide, readonly, ref, type InjectionKey, type Ref } from 'vue'

/**
 * 三档动效：
 * - full   桌面宽屏、支持 WebGL、未开启减弱动效、设备性能足够：3D + Lenis + 粘性分镜
 * - lite   移动端 / 窄屏 / 低内存低核数：无 3D、原生滚动、纵向逐屏入场
 * - static prefers-reduced-motion: reduce：无滚动驱动动画与 3D，内容全部可读
 * SSR 与首帧一律按 static 渲染，挂载后再升级，保证 HTML 内容完整且无水合差异。
 */
export type MotionTier = 'full' | 'lite' | 'static'

const KEY: InjectionKey<Readonly<Ref<MotionTier>>> = Symbol('motion-tier')

export const QUERIES = {
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
} as const

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return true
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return true
  return false
}

export function detectTier(): MotionTier {
  if (typeof window === 'undefined') return 'static'
  if (window.matchMedia(QUERIES.reduce).matches) return 'static'
  const desktop = window.matchMedia(QUERIES.desktop).matches
  const coarse = window.matchMedia('(pointer: coarse)').matches && !desktop
  if (!desktop || coarse || isLowEndDevice()) return 'lite'
  return supportsWebGL() ? 'full' : 'lite'
}

/** 在 App 根组件调用一次，向下提供当前档位 */
export function provideMotionTier() {
  const tier = ref<MotionTier>('static')
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const url = new URL(window.location.href)
    const forced = url.searchParams.get('motion') as MotionTier | null
    const update = () => {
      tier.value = forced && ['full', 'lite', 'static'].includes(forced) ? forced : detectTier()
      document.documentElement.dataset.motion = tier.value
    }
    update()
    const mqs = [window.matchMedia(QUERIES.reduce), window.matchMedia(QUERIES.desktop)]
    mqs.forEach((mq) => mq.addEventListener('change', update))
    cleanup = () => mqs.forEach((mq) => mq.removeEventListener('change', update))
  })
  onBeforeUnmount(() => cleanup?.())

  const value = readonly(tier)
  provide(KEY, value)
  return value
}

export function useMotionTier(): Readonly<Ref<MotionTier>> {
  return inject(KEY, ref<MotionTier>('static'))
}
