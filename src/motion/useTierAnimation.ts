import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { ensureGsap } from './gsap'
import { useMotionTier, type MotionTier } from './tier'

type Setup = (tier: MotionTier, scope: HTMLElement) => void | (() => void)

/**
 * 按档位创建一组 GSAP 动画：档位变化或组件卸载时整体 revert，
 * 所有选择器都限定在 scope 内。static 档不会调用 setup。
 */
export function useTierAnimation(scope: Ref<HTMLElement | null>, setup: Setup) {
  const tier = useMotionTier()
  let ctx: gsap.Context | undefined
  let extraCleanup: void | (() => void)

  const run = () => {
    ctx?.revert()
    extraCleanup?.()
    ctx = undefined
    extraCleanup = undefined
    const el = scope.value
    if (!el || tier.value === 'static') return
    const { gsap, ScrollTrigger } = ensureGsap()
    ctx = gsap.context(() => {
      extraCleanup = setup(tier.value, el)
    }, el)
    ScrollTrigger.refresh()
  }

  onMounted(() => {
    // 等字体与布局稳定一帧再测量
    requestAnimationFrame(run)
  })
  watch(tier, () => requestAnimationFrame(run))
  onBeforeUnmount(() => {
    ctx?.revert()
    extraCleanup?.()
  })
}
