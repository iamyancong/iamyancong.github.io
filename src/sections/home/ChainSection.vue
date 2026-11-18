<script setup lang="ts">
import { ref } from 'vue'
import { chainSteps } from '@/data/products'
import { gsap, ScrollTrigger } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const root = ref<HTMLElement | null>(null)
const current = ref(chainSteps.length - 1)

useTierAnimation(root, (level, el) => {
  const list = el.querySelector<HTMLElement>('.chain-list')
  const steps = gsap.utils.toArray<HTMLElement>('.chain-step', el)
  if (!list) return
  current.value = -1
  gsap.fromTo(
    '.chain-fill',
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: level === 'full' ? 0.6 : true },
    },
  )
  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      end: 'bottom 62%',
      onEnter: () => (current.value = Math.max(current.value, i)),
      onLeaveBack: () => (current.value = i - 1),
    })
    gsap.from(step.querySelector('.chain-card'), {
      opacity: 0,
      x: level === 'full' ? 60 : 24,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 85%' },
    })
  })
  return () => {
    current.value = chainSteps.length - 1
  }
})
</script>

<template>
  <section id="chain" ref="root" class="section chain" aria-labelledby="chain-title">
    <div class="container chain-grid">
      <div class="chain-copy">
        <p class="eyebrow">Delivery Pipeline</p>
        <h2 id="chain-title" class="section-title chain-title">从组件库到上线，<br />六步走完。</h2>
        <p class="section-lead">同一套模板、同一套规范，贯穿建项、开发、发布与运行；PC 与移动端都以 nginx 路径前缀发布。</p>
      </div>
      <ol class="chain-list">
        <span class="chain-rail" aria-hidden="true"><i class="chain-fill" /></span>
        <li v-for="(step, i) in chainSteps" :key="step.title" class="chain-step" :class="{ on: i <= current }">
          <span class="chain-node" aria-hidden="true">{{ i + 1 }}</span>
          <div class="chain-card">
            <h3>{{ step.title }}</h3>
            <p>{{ step.detail }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.chain-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 64px;
  align-items: start;
}

.chain-copy {
  position: sticky;
  top: calc(var(--nav-h) + 40px);
}

.chain-title {
  font-size: clamp(36px, 4.4vw, 60px);
}

.chain-list {
  position: relative;
  margin: 0;
  padding: 0 0 0 64px;
  list-style: none;
  display: grid;
  gap: 28px;
}

.chain-rail {
  position: absolute;
  left: 21px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--line);
  border-radius: 2px;
  overflow: hidden;
}

.chain-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--blue), var(--violet), var(--cyan));
  transform-origin: top;
}

.chain-step {
  position: relative;
}

.chain-node {
  position: absolute;
  left: -64px;
  top: 18px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text-3);
  background: var(--bg);
  border: 1px solid var(--line-strong);
  transition: all 0.5s var(--ease);
}

.chain-step.on .chain-node {
  color: #05060a;
  background: var(--text);
  border-color: transparent;
  box-shadow: 0 0 30px rgba(143, 179, 255, 0.5);
}

.chain-card {
  padding: 24px 26px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.01));
  transition: border-color 0.5s var(--ease);
}

.chain-step.on .chain-card {
  border-color: var(--line-strong);
}

.chain-card h3 {
  margin: 0;
  font-size: 20px;
}

.chain-card p {
  margin: 8px 0 0;
  color: var(--text-2);
  font-size: 15px;
}

@media (max-width: 900px) {
  .chain-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .chain-copy {
    position: static;
  }

  .chain-list {
    padding-left: 56px;
  }

  .chain-node {
    left: -56px;
    width: 38px;
    height: 38px;
  }

  .chain-rail {
    left: 18px;
  }
}
</style>
