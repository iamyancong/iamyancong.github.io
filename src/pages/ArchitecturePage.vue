<script setup lang="ts">
import { useHead } from '@unhead/vue'
import ArchMap from '@/components/ArchMap.vue'
import { chainSteps } from '@/data/products'
import { SITE } from '@/data/site'


const deployRows = [
  { target: 'yss-ui 及 npm 包', build: 'GitHub Actions 门禁、自动发版到 npm', run: 'npm 安装，文档在 GitHub Pages' },
  { target: '雨燕、SwiftVPN 桌面端', build: 'GitHub Actions 构建 Tauri 安装包', run: 'GitHub Releases 下载，内置自动更新' },
  { target: 'PC 业务微应用', build: '雨燕部署中心构建发布', run: 'Nginx 托管，qiankun 子应用接入' },
  { target: '移动端 H5（规划中）', build: '与 PC 一致：独立打包后放 nginx，按路径前缀部署', run: '嵌入 Capacitor App 或小程序 web-view 的页面，不用 qiankun' },
]

useHead({
  title: '架构全景',
  meta: [
    { name: 'description', content: '前端研发体系全景图：产品依赖关系、研发链路与部署形态。' },
    { property: 'og:title', content: `架构全景 · ${SITE.name}` },
    { property: 'og:url', content: `${SITE.url}/architecture/` },
  ],
  link: [{ rel: 'canonical', href: `${SITE.url}/architecture/` }],
})
</script>

<template>
  <div class="ap">
    <header class="container">
      <p class="eyebrow">Architecture</p>
      <h1 class="section-title">架构全景</h1>
      <p class="section-lead">以 YSS UI 为底座，主干向右流向部署；SwiftVPN 属于研发基础设施，独立于交付链路。节点可点击，虚线表示规划中。</p>
    </header>

    <section class="container ap-flow">
      <ArchMap />
    </section>

    <section class="container ap-section">
      <h2 class="ap-h2">部署形态</h2>
      <div class="ap-table" role="table" aria-label="部署形态">
        <div class="ap-row ap-head" role="row">
          <span role="columnheader">对象</span><span role="columnheader">构建与发布</span><span role="columnheader">运行方式</span>
        </div>
        <div v-for="row in deployRows" :key="row.target" class="ap-row" role="row">
          <span role="cell" class="ap-strong">{{ row.target }}</span><span role="cell">{{ row.build }}</span><span role="cell">{{ row.run }}</span>
        </div>
      </div>
    </section>

    <section class="container ap-section">
      <h2 class="ap-h2">研发链路</h2>
      <ol class="ap-steps">
        <li v-for="(s, i) in chainSteps" :key="s.title">
          <span class="ap-i">{{ i + 1 }}</span>
          <div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.detail }}</p>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.ap {
  padding: calc(var(--nav-h) + 64px) 0 120px;
}

.ap-flow {
  margin-top: 48px;
}

.ap-section {
  margin-top: 96px;
}

.ap-h2 {
  margin: 0 0 24px;
  font-size: clamp(28px, 3.4vw, 40px);
}

.ap-table {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.ap-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1.4fr;
  gap: 20px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--line);
  font-size: 15px;
  color: var(--text-2);
}

.ap-row:last-child {
  border-bottom: 0;
}

.ap-head {
  font-size: 13px;
  color: var(--text-3);
  background: rgba(255, 255, 255, 0.03);
}

.ap-strong {
  color: var(--text);
  font-weight: 600;
}

.ap-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ap-steps li {
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  display: grid;
  gap: 12px;
}

.ap-i {
  font-family: var(--mono);
  color: var(--cyan);
}

.ap-steps h3 {
  margin: 0;
  font-size: 18px;
}

.ap-steps p {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-2);
}

@media (max-width: 860px) {
  .ap-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .ap-head {
    display: none;
  }

  .ap-steps {
    grid-template-columns: 1fr;
  }
}
</style>
