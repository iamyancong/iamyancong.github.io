<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import ClientOnly from '@/components/ClientOnly.vue'
import { layers, productMap, relations, type ProductId } from '@/data/products'
import { gsap } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const ArchFlow = defineAsyncComponent(() => import('@/components/ArchFlow.vue'))

const root = ref<HTMLElement | null>(null)
const active = ref(layers.length - 1)

const accentOf = (id: string) => (id === 'deploy' ? '#94a3b8' : productMap[id as ProductId].accent)
const linkOf = (id: string) => (id === 'deploy' ? null : `/products/${id}`)

useTierAnimation(root, (level, el) => {
  const plates = gsap.utils.toArray<HTMLElement>('.plate', el)
  if (level === 'full') {
    active.value = 0
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el.querySelector('.stage'),
        start: 'top top',
        end: `+=${plates.length * 70}%`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        refreshPriority: 2,
        onUpdate: (self) => {
          active.value = Math.min(plates.length - 1, Math.floor(self.progress * plates.length * 0.999))
        },
      },
    })
    plates.forEach((plate, i) => {
      tl.from(plate, { z: 520, opacity: 0, scale: 0.86, duration: 1, ease: 'power3.out' }, i)
    })
    tl.from('.stack-glow', { opacity: 0, duration: plates.length }, 0)
    return () => {
      active.value = layers.length - 1
    }
  }
  // lite：不 pin，逐层随滚动入场
  plates.forEach((plate) => {
    gsap.from(plate, {
      opacity: 0,
      z: 160,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.stack'), start: 'top 80%' },
    })
  })
  gsap.from('.flow-wrap', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.flow-wrap', start: 'top 88%' },
  })
})
</script>

<template>
  <section id="architecture" ref="root" class="arch" aria-labelledby="arch-title">
    <div class="stage">
      <div class="container stage-grid">
        <div class="stage-copy">
          <p class="eyebrow">Architecture</p>
          <h2 id="arch-title" class="section-title stage-title">六层叠起，<br />就是一条交付链路。</h2>
          <ol class="layer-list">
            <li v-for="(layer, i) in layers" :key="layer.id" :class="{ on: i <= active, current: i === active }">
              <span class="layer-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="layer-text">
                <span class="layer-title">{{ layer.title }}</span>
                <span class="layer-detail">{{ layer.name }} · {{ layer.detail }}</span>
              </span>
            </li>
          </ol>
        </div>
        <div class="stack-wrap" aria-hidden="true">
          <div class="stack-glow" />
          <div class="stack">
            <div v-for="(layer, i) in layers" :key="layer.id" class="plate-slot" :style="{ '--i': i, '--accent': accentOf(layer.id) }">
              <div class="plate" :class="{ current: i === active }">
                <span class="plate-name">{{ layer.name }}</span>
                <span class="plate-title">{{ layer.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container flow-section">
      <div class="flow-head">
        <h3 class="flow-title">体系全景图</h3>
        <p class="flow-lead">每个节点都是一个产品，点击进入详情；箭头是真实的依赖与流转关系。</p>
      </div>
      <div class="flow-wrap">
        <ClientOnly>
          <ArchFlow height="clamp(380px, 46vw, 580px)" />
          <template #fallback>
            <ul class="flow-fallback">
              <li v-for="r in relations" :key="`${r.from}-${r.to}`">
                <component :is="linkOf(r.from) ? 'RouterLink' : 'span'" :to="linkOf(r.from) ?? undefined">{{ r.from === 'deploy' ? 'Nginx 部署' : productMap[r.from as ProductId].name }}</component>
                <span class="arrow">{{ r.planned ? '⇢' : '→' }}</span>
                <component :is="linkOf(r.to) ? 'RouterLink' : 'span'" :to="linkOf(r.to) ?? undefined">{{ r.to === 'deploy' ? 'Nginx 部署' : productMap[r.to as ProductId].name }}</component>
                <span class="rel">{{ r.label }}</span>
              </li>
            </ul>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<style scoped>
.arch {
  position: relative;
  padding-bottom: clamp(96px, 12vw, 160px);
}

.stage {
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: calc(var(--nav-h) + 24px) 0 48px;
}

.stage-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

.stage-title {
  font-size: clamp(36px, 4.4vw, 60px);
}

.layer-list {
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0;
}

.layer-list li {
  display: flex;
  gap: 18px;
  padding: 10px 0;
  border-top: 1px solid var(--line);
  opacity: 0.35;
  transition: opacity 0.5s var(--ease);
}

.layer-list li.on {
  opacity: 0.7;
}

.layer-list li.current {
  opacity: 1;
}

.layer-index {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
  padding-top: 3px;
}

.layer-text {
  display: grid;
  gap: 2px;
}

.layer-title {
  font-size: 18px;
  font-weight: 700;
}

.layer-detail {
  font-size: 14px;
  color: var(--text-2);
}

.stack-wrap {
  position: relative;
  height: min(620px, 70vh);
  perspective: 1600px;
  display: grid;
  place-items: center;
}

.stack-glow {
  position: absolute;
  inset: 10% 5%;
  background: radial-gradient(circle at 50% 60%, rgba(79, 124, 255, 0.35), transparent 60%);
  filter: blur(40px);
}

.stack {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  transform: rotateX(58deg) rotateZ(-42deg) translateZ(-150px);
}

.plate-slot {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--i) * 60px));
}

.plate {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--accent) 34%, transparent), rgba(10, 12, 20, 0.55) 70%),
    rgba(10, 12, 20, 0.6);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 30px 60px -30px color-mix(in srgb, var(--accent) 70%, transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 22px 24px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition:
    box-shadow 0.5s var(--ease),
    border-color 0.5s var(--ease);
}

.plate.current {
  border-color: var(--accent);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 0 60px -6px color-mix(in srgb, var(--accent) 70%, transparent);
}

.plate-name {
  font-size: 20px;
  font-weight: 700;
}

.plate-title {
  font-size: 13px;
  color: var(--text-2);
}

.flow-section {
  margin-top: 40px;
}

.flow-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.flow-title {
  margin: 0;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
}

.flow-lead {
  margin: 0;
  color: var(--text-2);
  max-width: 520px;
}

.flow-fallback {
  margin: 0;
  padding: 24px;
  list-style: none;
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  min-height: clamp(380px, 46vw, 580px);
}

.flow-fallback li {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: baseline;
}

.flow-fallback a {
  font-weight: 600;
}

.arrow {
  color: var(--text-3);
}

.rel {
  font-size: 13px;
  color: var(--text-3);
}

@media (max-width: 1023px) {
  .stage {
    min-height: auto;
  }

  .stage-grid {
    grid-template-columns: 1fr;
  }

  .stack-wrap {
    height: 460px;
    order: -1;
  }

  .stack {
    width: 220px;
    height: 220px;
  }

  .plate-slot {
    transform: translateZ(calc(var(--i) * 40px));
  }

  .plate {
    padding: 16px 18px;
  }

  .plate-name {
    font-size: 16px;
  }
}
</style>
