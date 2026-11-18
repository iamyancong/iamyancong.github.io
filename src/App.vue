<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import { SITE } from './data/site'
import { disableSmoothScroll, enableSmoothScroll } from './motion/smoothScroll'
import { provideMotionTier } from './motion/tier'

const tier = provideMotionTier()

watch(tier, (value) => {
  if (value === 'full') void enableSmoothScroll()
  else disableSmoothScroll()
})
onBeforeUnmount(disableSmoothScroll)

// 字体与图片加载完成后重新测量所有滚动触发点
onMounted(() => {
  const refresh = () => void import('./motion/gsap').then(({ ensureGsap }) => ensureGsap().ScrollTrigger.refresh())
  if (document.readyState === 'complete') refresh()
  else window.addEventListener('load', refresh, { once: true })
  void document.fonts?.ready.then(refresh)

  // 没有首屏入场动画可接管时（非首页或 static 档），立即撤掉 index.html 的预隐藏
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (tier.value === 'static' || !document.querySelector('.hero-title')) {
        document.documentElement.classList.remove('motion-boot')
      }
    }),
  )
})

useHead({
  htmlAttrs: { lang: 'zh-CN' },
  titleTemplate: (title?: string) => (title ? `${title} · ${SITE.name}` : SITE.name),
  meta: [
    { name: 'description', content: SITE.description },
    { name: 'author', content: SITE.author },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${SITE.url}/og.svg` },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <a class="skip-link" href="#main">跳到正文</a>
  <NavBar />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter />
</template>
