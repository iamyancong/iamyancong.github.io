<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({ title: '页面不存在', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <section class="nf container">
    <p class="eyebrow">404</p>
    <h1 class="section-title">这个页面不存在</h1>
    <p class="section-lead">可能链接已经变化。回到首页，或直接看体系全景。</p>
    <div class="nf-actions">
      <RouterLink to="/" class="btn btn-primary">回到首页</RouterLink>
      <RouterLink to="/architecture" class="btn">架构全景</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.nf {
  min-height: 80vh;
  padding: calc(var(--nav-h) + 96px) 0 96px;
}

.nf-actions {
  margin-top: 36px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
