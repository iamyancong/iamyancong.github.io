<script setup lang="ts">
import { ref } from 'vue'
import ProductVisual from '@/components/visuals/ProductVisual.vue'
import { GROUP_LABEL, products, STATUS_LABEL } from '@/data/products'
import { gsap } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const progress = ref(0)

useTierAnimation(root, (level, el) => {
  const cards = gsap.utils.toArray<HTMLElement>('.p-card', el)
  if (level === 'full' && track.value) {
    const trackEl = track.value
    const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 48)
    const tween = gsap.to(trackEl, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: el.querySelector('.p-pin'),
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.value = self.progress
        },
      },
    })
    // 卡片内视觉随横向位置轻微视差
    cards.forEach((card) => {
      gsap.from(card.querySelector('.p-visual'), {
        xPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left right',
          end: 'center center',
          scrub: true,
        },
      })
    })
    return () => {
      progress.value = 0
    }
  }
  cards.forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    })
  })
})
</script>

<template>
  <section id="products" ref="root" class="products" aria-labelledby="products-title">
    <div class="p-pin">
      <div class="container p-head">
        <div>
          <p class="eyebrow">Products</p>
          <h2 id="products-title" class="section-title products-title">每一层，都是一个<br /><span class="grad-text">独立可用</span>的产品。</h2>
        </div>
        <div class="p-progress" aria-hidden="true"><i :style="{ transform: `scaleX(${progress})` }" /></div>
      </div>
      <div ref="track" class="p-track">
        <article v-for="p in products" :key="p.id" class="p-card" :style="{ '--accent': p.accent }">
          <div class="p-top">
            <span class="pill" :data-status="p.status">{{ STATUS_LABEL[p.status] }}</span>
            <span class="p-eyebrow">{{ p.eyebrow }}</span>
          </div>
          <p v-if="p.group === 'infra'" class="p-group">{{ GROUP_LABEL.infra }}</p>
          <h3 class="p-name">{{ p.name }}</h3>
          <p class="p-tagline">{{ p.tagline }}</p>
          <div class="p-visual">
            <ProductVisual :id="p.id" />
          </div>
          <ul class="p-caps">
            <li v-for="c in p.capabilities.slice(0, 3)" :key="c.title">{{ c.title }}</li>
          </ul>
          <div class="p-stack">
            <span v-for="s in p.stack.slice(0, 4)" :key="s" class="tag">{{ s }}</span>
          </div>
          <RouterLink :to="`/products/${p.id}`" class="p-link">了解 {{ p.short }} <span aria-hidden="true">→</span></RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.products {
  position: relative;
}

.p-pin {
  min-height: 100svh;
  padding: calc(var(--nav-h) + 20px) 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.p-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
}

/* 矮屏下收起技术栈标签，保证固定阶段的卡片完整落在视口内 */
@media (max-height: 980px) {
  [data-motion='full'] .p-stack {
    display: none;
  }
}

.products-title {
  font-size: clamp(34px, 4.2vw, 58px);
}

.p-progress {
  width: 200px;
  height: 2px;
  background: var(--line);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 18px;
}

.p-progress i {
  display: block;
  height: 100%;
  background: var(--grad);
  transform-origin: left;
}

.p-track {
  margin-top: 36px;
  display: flex;
  gap: 24px;
  padding-left: var(--container-inset);
  padding-right: 24px;
  width: max-content;
  will-change: transform;
}

.p-card {
  position: relative;
  width: 400px;
  flex: none;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 28px;
  border: 1px solid var(--line);
  background:
    radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  overflow: hidden;
  transition:
    border-color 0.4s var(--ease),
    transform 0.4s var(--ease);
}

.p-card:hover {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  transform: translateY(-4px);
}

.p-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.p-eyebrow {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
}

.p-group {
  margin: 16px 0 -8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(252, 211, 77, 0.9);
}

.p-name {
  margin: 18px 0 0;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 700;
}

.p-tagline {
  margin: 10px 0 0;
  color: var(--text-2);
}

.p-visual {
  margin-top: 18px;
  min-height: 196px;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--line);
}

.p-caps {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.p-caps li {
  position: relative;
  padding-left: 18px;
  font-size: 14px;
  color: var(--text-2);
}

.p-caps li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.p-stack {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.p-stack .tag {
  font-size: 12px;
  padding: 3px 10px;
}

.p-link {
  margin-top: auto;
  padding-top: 16px;
  font-weight: 600;
  color: var(--text);
}

.p-link span {
  display: inline-block;
  transition: transform 0.3s var(--ease);
}

.p-link:hover span {
  transform: translateX(4px);
}

.p-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

@media (max-width: 640px) {
  .p-card {
    padding: 22px;
  }
}
</style>

<style>
/* 非 full 档：纵向/网格排列，不横向滚动 */
html:not([data-motion='full']) .products .p-track {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  padding: 0;
  margin-inline: auto;
  width: min(var(--container), calc(100% - 2 * var(--gutter)));
}

html:not([data-motion='full']) .products .p-card {
  width: auto;
}

html:not([data-motion='full']) .products .p-progress {
  display: none;
}

html:not([data-motion='full']) .products .p-pin {
  min-height: auto;
  padding-top: clamp(96px, 14vw, 160px);
}

@media (max-width: 640px) {
  html:not([data-motion='full']) .products .p-track {
    width: calc(100% - 40px);
  }
}
</style>
