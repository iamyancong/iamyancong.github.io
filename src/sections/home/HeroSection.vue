<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import ClientOnly from '@/components/ClientOnly.vue'
import HeroPoster from '@/components/HeroPoster.vue'
import { LINKS, SITE } from '@/data/site'
import { gsap, SplitText } from '@/motion/gsap'
import { scrollToTarget } from '@/motion/smoothScroll'
import { useMotionTier } from '@/motion/tier'
import { useTierAnimation } from '@/motion/useTierAnimation'

// three / TresJS 只在 full 档按需加载，独立分包
const HeroScene = defineAsyncComponent(() => import('@/three/HeroScene.vue'))

const root = ref<HTMLElement | null>(null)
const tier = useMotionTier()
const showScene = computed(() => tier.value === 'full')
const sceneReady = ref(false)
const scatter = ref(0)
const pointer = ref({ x: 0, y: 0 })

function onPointer(e: PointerEvent) {
  pointer.value = {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: (e.clientY / window.innerHeight) * 2 - 1,
  }
}

onMounted(() => window.addEventListener('pointermove', onPointer, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('pointermove', onPointer))

useTierAnimation(root, (level, el) => {
  const title = el.querySelector<HTMLElement>('.hero-title')
  const split = title ? SplitText.create(title, { type: 'chars', charsClass: 'hero-char' }) : null
  const intro = gsap.timeline()
  if (split) {
    intro.from(split.chars, {
      yPercent: 110,
      opacity: 0,
      rotateX: -70,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.045,
    })
  }
  intro
    .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out' }, 0.15)
    .from('.hero-sub', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out' }, 0.45)
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.6)
    .from('.hero-scroll', { opacity: 0, duration: 0.8 }, 1)

  // 滚动离场：文字上移淡出，3D 粒子随进度散开
  gsap.to('.hero-content', {
    yPercent: level === 'full' ? -18 : -8,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        scatter.value = self.progress
      },
    },
  })
  return () => split?.revert()
})

function explore() {
  scrollToTarget('#architecture')
}
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <HeroPoster :class="{ dim: showScene && sceneReady }" class="hero-poster" />
    <ClientOnly>
      <div v-if="showScene" class="hero-scene" :class="{ ready: sceneReady }">
        <Suspense @resolve="sceneReady = true">
          <HeroScene :scatter="scatter" :pointer-x="pointer.x" :pointer-y="pointer.y" />
        </Suspense>
      </div>
    </ClientOnly>

    <div class="hero-content container">
      <p class="hero-eyebrow eyebrow">Frontend Architecture · iamyancong</p>
      <h1 id="hero-title" class="hero-title">前端研发体系</h1>
      <p class="hero-sub">{{ SITE.tagline }}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" @click="explore">
          探索体系 <span class="btn-arrow" aria-hidden="true">→</span>
        </button>
        <a class="btn" :href="LINKS.yssDocs" target="_blank" rel="noopener">YSS UI 文档 <span aria-hidden="true">↗</span></a>
      </div>
    </div>

    <div class="hero-scroll" aria-hidden="true">
      <span>向下滚动</span>
      <i />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  align-items: end;
  overflow: hidden;
  isolation: isolate;
}

.hero-poster {
  z-index: -2;
  transition: opacity 1.2s var(--ease);
}

.hero-poster.dim :deep(.swift) {
  opacity: 0;
  transition: opacity 1.2s var(--ease);
}

.hero-scene {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  transition: opacity 1.6s var(--ease);
}

.hero-scene.ready {
  opacity: 1;
}

.hero-content {
  position: relative;
  isolation: isolate;
  padding-top: calc(var(--nav-h) + 38vh);
  padding-bottom: 150px;
  text-align: center;
}

.hero-content::before {
  content: '';
  position: absolute;
  inset: 30% 6% 12%;
  z-index: -1;
  background: radial-gradient(ellipse at 50% 50%, rgba(5, 6, 10, 0.55), transparent 70%);
  pointer-events: none;
}

.hero-eyebrow {
  justify-content: center;
}

.hero-title {
  margin: 22px 0 0;
  font-size: clamp(56px, 10vw, 140px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(180deg, #ffffff 30%, rgba(214, 222, 255, 0.62) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  perspective: 600px;
}

.hero-title :deep(.hero-char) {
  display: inline-block;
  background: inherit;
  -webkit-background-clip: text;
  background-clip: text;
  transform-origin: 50% 100%;
}

.hero-sub {
  margin: 28px auto 0;
  max-width: 760px;
  font-size: clamp(17px, 2vw, 22px);
  line-height: 1.65;
  color: var(--text-2);
}

.hero-actions {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--text-3);
}

.hero-scroll i {
  width: 1px;
  height: 28px;
  background: linear-gradient(var(--text-2), transparent);
  animation: scroll-line 2.2s var(--ease) infinite;
  transform-origin: top;
}

@keyframes scroll-line {
  0% {
    transform: scaleY(0);
  }

  50% {
    transform: scaleY(1);
  }

  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.12em;
  }

  .hero-eyebrow::before {
    display: none;
  }

  .hero-content {
    padding-bottom: 140px;
  }
}
</style>
