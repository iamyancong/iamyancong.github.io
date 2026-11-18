<script setup lang="ts">
import { products } from '@/data/products'
import { LINKS, SITE } from '@/data/site'

const year = 2026
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <p class="footer-name">{{ SITE.name }}</p>
        <p class="footer-tagline">{{ SITE.tagline }}</p>
      </div>
      <div>
        <p class="footer-title">产品</p>
        <ul>
          <li v-for="p in products" :key="p.id">
            <RouterLink :to="`/products/${p.id}`">{{ p.name }}</RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <p class="footer-title">资源</p>
        <ul>
          <li><a :href="LINKS.yssDocs" target="_blank" rel="noopener">YSS UI 文档</a></li>
          <li><a :href="LINKS.npmOrg" target="_blank" rel="noopener">@yss-ui on npm</a></li>
          <li><RouterLink to="/architecture">架构全景</RouterLink></li>
          <li><a :href="LINKS.github" target="_blank" rel="noopener">GitHub · iamyancong</a></li>
          <li><a :href="LINKS.siteRepo" target="_blank" rel="noopener">本站源码</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© {{ year }} {{ SITE.author }} · {{ SITE.role }}</span>
      <span>Vite · Vue 3 · GSAP · Lenis · TresJS · Vue Flow</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  padding: 72px 0 40px;
  background: var(--bg);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
}

.footer-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.footer-tagline {
  margin: 12px 0 0;
  max-width: 420px;
  color: var(--text-3);
  font-size: 14px;
}

.footer-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-3);
  letter-spacing: 0.12em;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

li a {
  font-size: 14px;
  color: var(--text-2);
  transition: color 0.2s;
}

li a:hover {
  color: var(--text);
}

.footer-bottom {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-3);
}

@media (max-width: 760px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}
</style>
