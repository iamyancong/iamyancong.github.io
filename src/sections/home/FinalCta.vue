<script setup lang="ts">
import { ref } from 'vue'
import MagneticButton from '@/components/MagneticButton.vue'
import { LINKS } from '@/data/site'
import { gsap, SplitText } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const root = ref<HTMLElement | null>(null)

useTierAnimation(root, (_level, el) => {
  const title = el.querySelector<HTMLElement>('.cta-title')
  if (!title) return
  const split = SplitText.create(title, { type: 'lines', linesClass: 'split-line', mask: 'lines' })
  gsap.from(split.lines, {
    yPercent: 100,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 70%' },
  })
  // 只动容器：按钮自身的 transform 由磁吸效果绑定，避免与 GSAP 抢写
  gsap.from('.cta-actions', {
    opacity: 0,
    y: 24,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 65%' },
  })
  return () => split.revert()
})
</script>

<template>
  <section ref="root" class="cta" aria-labelledby="cta-title">
    <div class="cta-glow" aria-hidden="true" />
    <div class="container cta-inner">
      <p class="eyebrow">Open Source</p>
      <h2 id="cta-title" class="cta-title">从组件到上线，<br /><span class="grad-text">一条链路。</span></h2>
      <p class="section-lead cta-lead">组件库、脚手架、模板与桌面工具都开源在 GitHub，组件与工具包发布在 npm。</p>
      <div class="cta-actions">
        <MagneticButton :href="LINKS.github" primary external>GitHub · iamyancong ↗</MagneticButton>
        <MagneticButton :href="LINKS.yssDocs" external>YSS UI 文档 ↗</MagneticButton>
        <MagneticButton :href="LINKS.npmOrg" external>@yss-ui on npm ↗</MagneticButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  padding: clamp(120px, 18vw, 220px) 0;
  overflow: hidden;
  text-align: center;
}

.cta-glow {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 90vmax;
  height: 60vmax;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(ellipse at 35% 50%, rgba(79, 124, 255, 0.32), transparent 55%),
    radial-gradient(ellipse at 65% 50%, rgba(139, 92, 246, 0.28), transparent 55%);
  filter: blur(40px);
  pointer-events: none;
}

.cta-inner {
  position: relative;
}

.cta-inner .eyebrow {
  justify-content: center;
}

.cta-title {
  margin: 22px 0 0;
  font-size: clamp(44px, 8vw, 112px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.cta-lead {
  margin-inline: auto;
}

.cta-actions {
  margin-top: 48px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
