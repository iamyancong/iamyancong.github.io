<script setup lang="ts">
import { ref } from 'vue'
import { roadmap, type RoadmapPhase } from '@/data/products'
import { gsap } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const root = ref<HTMLElement | null>(null)
const phases = Object.keys(roadmap) as RoadmapPhase[]

const toneOf = (status: string) => (status === '进行中' ? 'live' : status === '规划中' ? 'plain' : 'warn')

useTierAnimation(root, (_level, el) => {
  gsap.utils.toArray<HTMLElement>('.road-col', el).forEach((col, i) => {
    gsap.from(col, {
      opacity: 0,
      y: 60,
      duration: 1,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.road-grid'), start: 'top 80%' },
    })
  })
})
</script>

<template>
  <section id="roadmap" ref="root" class="section roadmap" aria-labelledby="roadmap-title">
    <div class="container">
      <p class="eyebrow">Roadmap</p>
      <h2 id="roadmap-title" class="section-title">演进路线</h2>
      <p class="section-lead">先把门面和规范立起来，再把移动端接进同一条链路，最后让 AI 从需求直达页面。</p>
      <div class="road-grid">
        <div v-for="(phase, i) in phases" :key="phase" class="road-col">
          <div class="road-head">
            <span class="road-index">0{{ i + 1 }}</span>
            <h3>{{ roadmap[phase].label }}</h3>
          </div>
          <ul>
            <li v-for="item in roadmap[phase].items" :key="item.title">
              <div class="road-item-top">
                <span class="road-title">{{ item.title }}</span>
                <span class="pill" :data-tone="toneOf(item.status)">{{ item.status }}</span>
              </div>
              <p>{{ item.detail }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.road-grid {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.road-col {
  padding: 28px;
  border-radius: 28px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
}

.road-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.road-index {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
}

.road-head h3 {
  margin: 0;
  font-size: 26px;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.road-item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.road-title {
  font-weight: 600;
}

li p {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-2);
}

@media (max-width: 960px) {
  .road-grid {
    grid-template-columns: 1fr;
  }
}
</style>
