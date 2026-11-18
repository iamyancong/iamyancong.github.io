<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { GROUP_LABEL, productMap, relations, STATUS_LABEL, type GraphNodeId, type ProductId } from '@/data/products'

/**
 * 体系全景图外壳：
 * - 宽屏（≥ 760px）客户端加载可交互的 Vue Flow 画布；
 * - 窄屏与 SSR 输出同一份数据生成的分层卡片图，手机上可读、无 JS 也完整。
 */
const ArchFlow = defineAsyncComponent(() => import('./ArchFlow.vue'))

const wide = ref(false)
let mq: MediaQueryList | undefined
const sync = () => (wide.value = Boolean(mq?.matches))

onMounted(() => {
  mq = window.matchMedia('(min-width: 760px)')
  sync()
  mq.addEventListener('change', sync)
})
onBeforeUnmount(() => mq?.removeEventListener('change', sync))

const nameOf = (id: GraphNodeId) => (id === 'deploy' ? 'Nginx 部署' : productMap[id].name)

const stages: { title: string; ids: GraphNodeId[] }[] = [
  { title: '底座', ids: ['yss-ui'] },
  { title: 'AI 与脚手架', ids: ['ai-kit', 'create-yss-app'] },
  { title: '模板与运行时', ids: ['microapp-template', 'qiankun'] },
  { title: '平台与部署', ids: ['yuyan', 'deploy'] },
  { title: '规划中', ids: ['mobile'] },
]

const upstream = (id: GraphNodeId) => relations.filter((r) => r.to === id)
const card = (id: GraphNodeId) =>
  id === 'deploy'
    ? { name: 'Nginx 部署', sub: '按路径前缀发布 · 可回滚', accent: '#94a3b8', status: '', link: null }
    : {
        name: productMap[id].name,
        sub: productMap[id].tagline,
        accent: productMap[id].accent,
        status: STATUS_LABEL[productMap[id].status],
        link: `/products/${id as ProductId}`,
      }
const vpn = productMap.swiftvpn
</script>

<template>
  <ArchFlow v-if="wide" />
  <div v-else class="map">
    <ol class="map-stages">
      <li v-for="stage in stages" :key="stage.title" class="map-stage">
        <p class="map-stage-title">{{ stage.title }}</p>
        <div class="map-cards">
          <component
            :is="card(id).link ? 'RouterLink' : 'div'"
            v-for="id in stage.ids"
            :key="id"
            :to="card(id).link ?? undefined"
            class="map-card"
            :class="{ planned: id === 'mobile' }"
            :style="{ '--accent': card(id).accent }"
          >
            <span class="map-name">{{ card(id).name }}</span>
            <span class="map-sub">{{ card(id).sub }}</span>
            <span v-if="upstream(id).length" class="map-from">
              <span v-for="r in upstream(id)" :key="r.from" :class="{ planned: r.planned }">← {{ nameOf(r.from) }} · {{ r.label }}</span>
            </span>
          </component>
        </div>
      </li>
    </ol>
    <RouterLink to="/products/swiftvpn" class="map-infra" :style="{ '--accent': vpn.accent }">
      <span class="map-infra-label">{{ GROUP_LABEL.infra }}</span>
      <span class="map-name">{{ vpn.name }}</span>
      <span class="map-sub">{{ vpn.tagline }}</span>
    </RouterLink>
  </div>
</template>

<style scoped>
.map {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  background:
    radial-gradient(ellipse at 10% 0%, rgba(79, 124, 255, 0.12), transparent 60%),
    rgba(255, 255, 255, 0.015);
}

.map-stages {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 18px;
}

.map-stage {
  position: relative;
}

.map-stage + .map-stage::before {
  content: '↓';
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 18px;
  color: var(--text-3);
}

.map-stage-title {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--text-3);
}

.map-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: 10px;
}

.map-card,
.map-infra {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 16%, rgba(12, 14, 22, 0.96)), rgba(12, 14, 22, 0.96) 70%);
  color: var(--text);
}

.map-card.planned {
  border-style: dashed;
}

.map-name {
  font-size: 15px;
  font-weight: 700;
}

.map-sub {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text-2);
}

.map-from {
  margin-top: 4px;
  display: grid;
  gap: 2px;
  font-size: 11.5px;
  color: rgba(143, 179, 255, 0.85);
}

.map-from .planned {
  color: rgba(244, 114, 182, 0.85);
}

.map-infra {
  margin-top: 22px;
  border-style: dashed;
}

.map-infra-label {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(252, 211, 77, 0.9);
}
</style>
