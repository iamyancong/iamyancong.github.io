<script setup lang="ts">
import { ref } from 'vue'
import { gsap, SplitText } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const root = ref<HTMLElement | null>(null)

useTierAnimation(root, (level, el) => {
  const text = el.querySelector<HTMLElement>('.manifesto-text')
  if (!text) return
  // 中文没有空格分词，按字拆分后逐字点亮
  const split = SplitText.create(text, { type: 'chars', charsClass: 'm-char' })
  gsap.fromTo(
    split.chars,
    { opacity: 0.14 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: {
        trigger: text,
        start: level === 'full' ? 'top 78%' : 'top 85%',
        end: level === 'full' ? 'bottom 42%' : 'bottom 60%',
        scrub: level === 'full' ? 0.6 : true,
      },
    },
  )
  gsap.from('.manifesto-meta > *', {
    opacity: 0,
    y: 24,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.manifesto-meta', start: 'top 88%' },
  })
  return () => split.revert()
})
</script>

<template>
  <section ref="root" class="section manifesto" aria-label="定位">
    <div class="container">
      <p class="eyebrow">Manifesto</p>
      <p class="manifesto-text">
        把复杂中后台沉淀成一套可复用的交付能力。组件、规范、脚手架、模板、平台与部署，<span class="grad-text">一条链路</span>走到上线；再把这套规范交给
        AI，让它<span class="grad-text">按规范写代码</span>。
      </p>
      <div class="manifesto-meta">
        <div>
          <span class="meta-k">底座</span>
          <span class="meta-v">YSS UI · Vue 3</span>
        </div>
        <div>
          <span class="meta-k">交付</span>
          <span class="meta-v">脚手架 · 模板 · 雨燕</span>
        </div>
        <div>
          <span class="meta-k">AI</span>
          <span class="meta-v">MCP · Skills · llms.txt</span>
        </div>
        <div>
          <span class="meta-k">开源</span>
          <span class="meta-v">GitHub · npm</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manifesto-text {
  margin: 28px 0 0;
  font-size: clamp(30px, 4.6vw, 64px);
  line-height: 1.28;
  font-weight: 700;
  letter-spacing: -0.015em;
  max-width: 1100px;
}

.manifesto-text :deep(.m-char) {
  will-change: opacity;
}

.manifesto-text .grad-text :deep(.m-char) {
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.manifesto-meta {
  margin-top: 72px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--line);
}

.manifesto-meta > div {
  padding: 26px 24px;
  background: var(--bg);
  display: grid;
  gap: 8px;
}

.meta-k {
  font-size: 13px;
  color: var(--text-3);
  letter-spacing: 0.12em;
}

.meta-v {
  font-size: 17px;
  font-weight: 600;
}

@media (max-width: 760px) {
  .manifesto-meta {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
