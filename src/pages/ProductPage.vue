<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref } from 'vue'
import ProductVisual from '@/components/visuals/ProductVisual.vue'
import { downstreamOf, productMap, products, STATUS_LABEL, upstreamOf, type ProductId } from '@/data/products'
import { SITE } from '@/data/site'
import { gsap } from '@/motion/gsap'
import { useTierAnimation } from '@/motion/useTierAnimation'

const props = defineProps<{ id: ProductId }>()

const product = computed(() => productMap[props.id])
const upstream = computed(() => upstreamOf(props.id))
const downstream = computed(() => downstreamOf(props.id))
const index = computed(() => products.findIndex((p) => p.id === props.id))
const next = computed(() => products[(index.value + 1) % products.length])
const prev = computed(() => products[(index.value - 1 + products.length) % products.length])

useHead(() => ({
  title: product.value.name,
  meta: [
    { name: 'description', content: product.value.summary },
    { property: 'og:title', content: `${product.value.name} · ${SITE.name}` },
    { property: 'og:description', content: product.value.summary },
    { property: 'og:url', content: `${SITE.url}/products/${props.id}/` },
  ],
  link: [{ rel: 'canonical', href: `${SITE.url}/products/${props.id}/` }],
}))

const root = ref<HTMLElement | null>(null)
useTierAnimation(root, (_level, el) => {
  gsap.from(gsap.utils.toArray<HTMLElement>('.pd-hero > *', el), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power3.out',
  })
  gsap.utils.toArray<HTMLElement>('.pd-reveal', el).forEach((block) => {
    gsap.from(block, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: block, start: 'top 88%' },
    })
  })
})
</script>

<template>
  <article :key="id" ref="root" class="pd" :style="{ '--accent': product.accent }">
    <div class="pd-glow" aria-hidden="true" />
    <header class="container pd-hero">
      <RouterLink to="/#architecture" class="pd-back">← 体系全景</RouterLink>
      <div class="pd-meta">
        <span class="pill" :data-status="product.status">{{ STATUS_LABEL[product.status] }}</span>
        <span class="pd-eyebrow">{{ product.eyebrow }}</span>
      </div>
      <h1 class="pd-title">{{ product.name }}</h1>
      <p class="pd-tagline">{{ product.tagline }}</p>
      <p class="pd-summary">{{ product.summary }}</p>
      <div v-if="product.links.length" class="pd-links">
        <a v-for="(l, i) in product.links" :key="l.href" :href="l.href" class="btn" :class="{ 'btn-primary': i === 0 }" target="_blank" rel="noopener">
          {{ l.label }} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p v-else class="pd-note">调研阶段，暂未公开仓库。</p>
    </header>

    <section class="container pd-grid">
      <div class="pd-visual glass pd-reveal">
        <ProductVisual :id="product.id" />
      </div>
      <div class="pd-facts glass pd-reveal">
        <h2 class="pd-h">关键信息</h2>
        <dl>
          <div v-for="f in product.facts" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="container pd-section pd-reveal">
      <h2 class="pd-h2">核心能力</h2>
      <div class="pd-caps">
        <div v-for="(c, i) in product.capabilities" :key="c.title" class="pd-cap">
          <span class="pd-cap-i">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ c.title }}</h3>
          <p>{{ c.detail }}</p>
        </div>
      </div>
    </section>

    <section v-if="product.commands?.length" class="container pd-section pd-reveal">
      <h2 class="pd-h2">快速开始</h2>
      <pre class="pd-code mono"><code v-for="cmd in product.commands" :key="cmd"><span>$</span> {{ cmd }}
</code></pre>
    </section>

    <section class="container pd-section pd-reveal">
      <h2 class="pd-h2">技术栈</h2>
      <div class="pd-stack">
        <span v-for="s in product.stack" :key="s" class="tag">{{ s }}</span>
      </div>
    </section>

    <section v-if="upstream.length || downstream.length" class="container pd-section pd-reveal">
      <h2 class="pd-h2">在体系中的位置</h2>
      <div class="pd-rel">
        <div>
          <h3 class="pd-h">上游</h3>
          <p v-if="!upstream.length" class="pd-empty">体系底座，没有上游依赖。</p>
          <RouterLink v-for="u in upstream" :key="u.product.id" :to="`/products/${u.product.id}`" class="pd-rel-item" :class="{ planned: u.relation.planned }">
            <span class="pd-rel-dot" :style="{ background: u.product.accent }" />
            <span class="pd-rel-name">{{ u.product.name }}</span>
            <span class="pd-rel-label">{{ u.relation.label }}{{ u.relation.planned ? ' · 规划中' : '' }}</span>
          </RouterLink>
        </div>
        <div>
          <h3 class="pd-h">下游</h3>
          <p v-if="!downstream.length" class="pd-empty">{{ product.id === 'yuyan' ? '下游是 Nginx 部署：按路径前缀发布，版本可回滚。' : '暂无下游产品。' }}</p>
          <RouterLink v-for="d in downstream" :key="d.product.id" :to="`/products/${d.product.id}`" class="pd-rel-item" :class="{ planned: d.relation.planned }">
            <span class="pd-rel-dot" :style="{ background: d.product.accent }" />
            <span class="pd-rel-name">{{ d.product.name }}</span>
            <span class="pd-rel-label">{{ d.relation.label }}{{ d.relation.planned ? ' · 规划中' : '' }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <nav class="container pd-pager" aria-label="产品切换">
      <RouterLink :to="`/products/${prev.id}`" class="pd-page">
        <span>上一个</span>
        <strong>{{ prev.name }}</strong>
      </RouterLink>
      <RouterLink :to="`/products/${next.id}`" class="pd-page next">
        <span>下一个</span>
        <strong>{{ next.name }}</strong>
      </RouterLink>
    </nav>
  </article>
</template>

<style scoped>
.pd {
  position: relative;
  padding: calc(var(--nav-h) + 56px) 0 120px;
  overflow: hidden;
}

.pd-glow {
  position: absolute;
  left: 50%;
  top: -20vmax;
  width: 90vmax;
  height: 60vmax;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 60%);
  filter: blur(40px);
  pointer-events: none;
}

.pd-hero {
  position: relative;
}

.pd-back {
  font-size: 14px;
  color: var(--text-3);
  transition: color 0.2s;
}

.pd-back:hover {
  color: var(--text);
}

.pd-meta {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.pd-eyebrow {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}

.pd-title {
  margin: 20px 0 0;
  font-size: clamp(44px, 8vw, 96px);
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.pd-tagline {
  margin: 18px 0 0;
  font-size: clamp(22px, 2.6vw, 32px);
  font-weight: 600;
  background: linear-gradient(90deg, #fff, color-mix(in srgb, var(--accent) 80%, #fff));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pd-summary {
  margin: 18px 0 0;
  max-width: 760px;
  font-size: 18px;
  color: var(--text-2);
}

.pd-links {
  margin-top: 36px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pd-note {
  margin-top: 28px;
  color: var(--amber);
}

.pd-grid {
  position: relative;
  margin-top: 72px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.pd-visual {
  padding: 32px;
  display: flex;
  align-items: center;
  min-height: 320px;
}

.pd-facts {
  padding: 28px 32px;
}

.pd-h {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--text-3);
}

dl {
  margin: 0;
  display: grid;
}

dl > div {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

dl > div:last-child {
  border-bottom: 0;
}

dt {
  color: var(--text-3);
  font-size: 14px;
}

dd {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.pd-section {
  margin-top: 96px;
}

.pd-h2 {
  margin: 0 0 28px;
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.pd-caps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.pd-cap {
  padding: 30px;
  background: var(--bg);
}

.pd-cap-i {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
}

.pd-cap h3 {
  margin: 12px 0 0;
  font-size: 21px;
}

.pd-cap p {
  margin: 10px 0 0;
  color: var(--text-2);
}

.pd-code {
  margin: 0;
  padding: 24px 28px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.4);
  font-size: 15px;
  line-height: 2;
  overflow-x: auto;
}

.pd-code span {
  color: var(--cyan);
}

.pd-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pd-rel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pd-rel > div {
  padding: 26px 28px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  display: grid;
  align-content: start;
  gap: 10px;
}

.pd-empty {
  margin: 0;
  color: var(--text-3);
  font-size: 15px;
}

.pd-rel-item {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--line);
  transition:
    border-color 0.25s,
    background 0.25s;
}

.pd-rel-item:hover {
  border-color: var(--line-strong);
  background: rgba(255, 255, 255, 0.04);
}

.pd-rel-item.planned {
  border-style: dashed;
}

.pd-rel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pd-rel-name {
  font-weight: 600;
}

.pd-rel-label {
  font-size: 13px;
  color: var(--text-3);
}

.pd-pager {
  margin-top: 120px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pd-page {
  padding: 28px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  display: grid;
  gap: 6px;
  transition: border-color 0.25s;
}

.pd-page:hover {
  border-color: var(--line-strong);
}

.pd-page span {
  font-size: 13px;
  color: var(--text-3);
}

.pd-page strong {
  font-size: 22px;
}

.pd-page.next {
  text-align: right;
}

@media (max-width: 860px) {
  .pd-grid,
  .pd-caps,
  .pd-rel {
    grid-template-columns: 1fr;
  }

  dl > div {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .pd-pager {
    grid-template-columns: 1fr;
  }

  .pd-page.next {
    text-align: left;
  }
}
</style>
