<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'
import { LINKS, SITE } from '@/data/site'
import { scrollToTarget } from '@/motion/smoothScroll'

const route = useRoute()
const router = useRouter()
const scrolled = ref(false)
const menuOpen = ref(false)
const productsOpen = ref(false)

const sections = [
  { label: '体系全景', hash: '#architecture' },
  { label: '研发链路', hash: '#chain' },
  { label: '演进路线', hash: '#roadmap' },
]

function onScroll() {
  scrolled.value = window.scrollY > 24
}

async function goSection(hash: string) {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push({ path: '/', hash })
    return
  }
  scrollToTarget(hash)
  history.replaceState(history.state, '', hash)
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    productsOpen.value = false
  },
)
watch(menuOpen, (open) => {
  if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled, 'is-open': menuOpen }">
    <nav class="nav-inner container" aria-label="主导航">
      <RouterLink to="/" class="brand" aria-label="返回首页">
        <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="nav-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#8fb3ff" />
              <stop offset="0.55" stop-color="#8b5cf6" />
              <stop offset="1" stop-color="#22d3ee" />
            </linearGradient>
          </defs>
          <path d="M3 13c5-1 9 0 13 4 4-6 8-9 13-10-3 4-6 8-8 14-1 4-4 6-7 6l2-5c-4-1-8-4-13-9z" fill="url(#nav-g)" />
        </svg>
        <span class="brand-text">{{ SITE.shortName }}</span>
      </RouterLink>

      <ul class="nav-links">
        <li
          class="has-menu"
          @mouseenter="productsOpen = true"
          @mouseleave="productsOpen = false"
          @focusin="productsOpen = true"
          @focusout="productsOpen = false"
        >
          <button type="button" class="nav-link" :aria-expanded="productsOpen" @click="goSection('#products')">产品</button>
          <div class="menu glass" :class="{ open: productsOpen }">
            <RouterLink v-for="p in products" :key="p.id" :to="`/products/${p.id}`" class="menu-item">
              <span class="menu-dot" :style="{ background: p.accent }" />
              <span class="menu-name">{{ p.name }}</span>
              <span class="menu-tag">{{ p.tagline }}</span>
            </RouterLink>
          </div>
        </li>
        <li v-for="s in sections" :key="s.hash">
          <a :href="`/${s.hash}`" class="nav-link" @click.prevent="goSection(s.hash)">{{ s.label }}</a>
        </li>
        <li><RouterLink to="/architecture" class="nav-link">架构</RouterLink></li>
      </ul>

      <div class="nav-actions">
        <a :href="LINKS.yssDocs" class="nav-cta" target="_blank" rel="noopener">YSS UI 文档</a>
        <a :href="LINKS.github" class="nav-icon" target="_blank" rel="noopener" aria-label="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
        </a>
        <button type="button" class="nav-burger" :aria-expanded="menuOpen" aria-controls="mobile-menu" aria-label="打开菜单" @click="menuOpen = !menuOpen">
          <span /><span />
        </button>
      </div>
    </nav>
  </header>
  <!-- 放在 header 之外：header 的 backdrop-filter 会成为 fixed 子元素的包含块，菜单会被裁成 56px 高 -->
  <div id="mobile-menu" class="mobile-menu" :class="{ open: menuOpen }" :aria-hidden="!menuOpen">
    <div class="container mobile-inner">
      <p class="mobile-label">产品</p>
      <RouterLink v-for="p in products" :key="p.id" :to="`/products/${p.id}`" class="mobile-item" :tabindex="menuOpen ? 0 : -1">
        <span class="menu-dot" :style="{ background: p.accent }" />{{ p.name }}
      </RouterLink>
      <p class="mobile-label">浏览</p>
      <a v-for="s in sections" :key="s.hash" :href="`/${s.hash}`" class="mobile-item" :tabindex="menuOpen ? 0 : -1" @click.prevent="goSection(s.hash)">{{ s.label }}</a>
      <RouterLink to="/architecture" class="mobile-item" :tabindex="menuOpen ? 0 : -1">架构全景</RouterLink>
      <a :href="LINKS.yssDocs" class="mobile-item" target="_blank" rel="noopener" :tabindex="menuOpen ? 0 : -1">YSS UI 文档 ↗</a>
      <a :href="LINKS.github" class="mobile-item" target="_blank" rel="noopener" :tabindex="menuOpen ? 0 : -1">GitHub ↗</a>
    </div>
  </div>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--nav-h);
  transition:
    background 0.4s var(--ease),
    border-color 0.4s var(--ease),
    height 0.4s var(--ease);
  border-bottom: 1px solid transparent;
}

.nav.is-scrolled,
.nav.is-open {
  height: 56px;
  background: rgba(8, 9, 14, 0.72);
  border-bottom-color: var(--line);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.brand-mark {
  width: 26px;
  height: 26px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-2);
  font-size: 14px;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.has-menu {
  position: relative;
}

.menu {
  position: absolute;
  top: calc(100% + 10px);
  left: -12px;
  width: 420px;
  padding: 10px;
  display: grid;
  gap: 2px;
  background: rgba(14, 16, 24, 0.92);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease),
    visibility 0.25s;
}

.menu::before {
  content: '';
  position: absolute;
  inset: -12px 0 auto;
  height: 12px;
}

.menu.open {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.menu-item {
  display: grid;
  grid-template-columns: 10px 1fr;
  column-gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.menu-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
}

.menu-name {
  font-size: 14px;
  font-weight: 600;
}

.menu-tag {
  grid-column: 2;
  font-size: 12px;
  color: var(--text-3);
}

.nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-cta {
  height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #05060a;
  background: var(--text);
  transition: background 0.2s;
}

.nav-cta:hover {
  background: #fff;
}

.nav-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--text-2);
  transition:
    color 0.2s,
    background 0.2s;
}

.nav-icon:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
}

.nav-icon svg {
  width: 20px;
  height: 20px;
}

.nav-burger {
  display: none;
  width: 38px;
  height: 38px;
  border: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
}

.nav-burger span {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 1.5px;
  background: var(--text);
  transition: transform 0.35s var(--ease);
}

.nav-burger span:first-child {
  top: 15px;
}

.nav-burger span:last-child {
  top: 22px;
}

.is-open .nav-burger span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.is-open .nav-burger span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.mobile-menu {
  position: fixed;
  inset: 56px 0 0;
  z-index: 99;
  background: rgba(5, 6, 10, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease),
    visibility 0.3s;
  overflow-y: auto;
}

.mobile-menu.open {
  opacity: 1;
  visibility: visible;
}

.mobile-inner {
  padding: 16px 0 48px;
  display: grid;
}

.mobile-label {
  margin: 20px 0 6px;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--text-3);
}

.mobile-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid var(--line);
}

@media (min-width: 961px) {
  .mobile-menu {
    display: none;
  }
}

@media (max-width: 960px) {
  .nav-links,
  .nav-cta {
    display: none;
  }

  .nav-burger {
    display: block;
  }
}
</style>
