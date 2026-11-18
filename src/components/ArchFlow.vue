<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { Handle, MarkerType, Position, useVueFlow, VueFlow, type Edge, type Node, type NodeMouseEvent } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import { useRouter } from 'vue-router'
import { productMap, relations, STATUS_LABEL, type GraphNodeId, type ProductId } from '@/data/products'

withDefaults(defineProps<{ height?: string }>(), { height: '560px' })

const router = useRouter()
const { fitView } = useVueFlow()

function onReady() {
  void fitView({ padding: 0.06 })
  // 全景图挂载后页面高度可能变化，通知滚动动画重新测量
  void import('@/motion/gsap').then(({ ScrollTrigger }) => ScrollTrigger.refresh())
}

/** 手工布局：左侧底座，向右流向部署 */
const POSITIONS: Record<GraphNodeId, { x: number; y: number }> = {
  'yss-ui': { x: 0, y: 220 },
  'ai-kit': { x: 270, y: 30 },
  swiftvpn: { x: 270, y: 430 },
  'create-yss-app': { x: 540, y: 30 },
  qiankun: { x: 540, y: 290 },
  'microapp-template': { x: 810, y: 170 },
  mobile: { x: 810, y: 430 },
  yuyan: { x: 1080, y: 220 },
  deploy: { x: 1350, y: 220 },
}

interface NodeData {
  id: GraphNodeId
  name: string
  sub: string
  accent: string
  status?: string
  planned?: boolean
  clickable: boolean
}

const nodes: Node<NodeData>[] = (Object.keys(POSITIONS) as GraphNodeId[]).map((id) => {
  if (id === 'deploy') {
    return {
      id,
      type: 'arch',
      position: POSITIONS[id],
      data: { id, name: 'Nginx 部署', sub: '按路径前缀发布 · 可回滚', accent: '#94a3b8', clickable: false },
    }
  }
  const p = productMap[id]
  return {
    id,
    type: 'arch',
    position: POSITIONS[id],
    data: {
      id,
      name: p.name,
      sub: p.tagline,
      accent: p.accent,
      status: STATUS_LABEL[p.status],
      planned: p.status === 'research',
      clickable: true,
    },
  }
})

const edges: Edge[] = relations.map((r) => ({
  id: `${r.from}-${r.to}`,
  source: r.from,
  target: r.to,
  label: r.label,
  type: 'default',
  animated: !r.planned,
  class: r.planned ? 'is-planned' : '',
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: r.planned ? 'rgba(244,114,182,0.7)' : 'rgba(143,179,255,0.8)' },
}))

function onNodeClick({ node }: NodeMouseEvent) {
  const data = node.data as NodeData
  if (data.clickable) void router.push(`/products/${data.id as ProductId}`)
}
</script>

<template>
  <div class="flow" :style="{ height }">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="false"
      :min-zoom="0.12"
      :max-zoom="1.6"
      :zoom-on-scroll="false"
      :pan-on-scroll="false"
      :prevent-scrolling="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      :default-edge-options="{ type: 'default' }"
      @node-click="onNodeClick"
      @nodes-initialized="onReady"
    >
      <template #node-arch="{ data }">
        <div
          class="arch-node"
          :class="{ planned: data.planned, clickable: data.clickable }"
          :style="{ '--accent': data.accent }"
          :role="data.clickable ? 'link' : undefined"
          :aria-label="data.clickable ? `查看 ${data.name}` : data.name"
        >
          <Handle type="target" :position="Position.Left" :connectable="false" />
          <Handle type="source" :position="Position.Right" :connectable="false" />
          <span class="arch-dot" />
          <span class="arch-name">{{ data.name }}</span>
          <span class="arch-sub">{{ data.sub }}</span>
          <span v-if="data.status" class="arch-status">{{ data.status }}</span>
          <span v-if="data.clickable" class="arch-go" aria-hidden="true">→</span>
        </div>
      </template>
      <Background pattern-color="rgba(255,255,255,0.08)" :gap="28" />
      <Controls :show-interactive="false" position="bottom-right" />
    </VueFlow>
    <p class="flow-hint">拖拽平移 · 右下角缩放 · 点击节点进入产品页 · 虚线为规划中</p>
  </div>
</template>

<style scoped>
.flow {
  position: relative;
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    radial-gradient(ellipse at 20% 0%, rgba(79, 124, 255, 0.12), transparent 60%),
    radial-gradient(ellipse at 90% 100%, rgba(139, 92, 246, 0.12), transparent 60%),
    rgba(255, 255, 255, 0.015);
  overflow: hidden;
}

.flow-hint {
  position: absolute;
  left: 18px;
  bottom: 12px;
  margin: 0;
  right: 72px;
  font-size: 12px;
  color: var(--text-3);
  pointer-events: none;
}

.arch-node {
  position: relative;
  width: 214px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 18%, rgba(12, 14, 22, 0.96)), rgba(12, 14, 22, 0.96) 70%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 18px 50px -20px color-mix(in srgb, var(--accent) 60%, transparent);
  display: grid;
  gap: 4px;
  color: var(--text);
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
}

.arch-node.clickable {
  cursor: pointer;
}

.arch-node.clickable:hover {
  transform: translateY(-3px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 24px 60px -16px color-mix(in srgb, var(--accent) 80%, transparent);
}

.arch-node.planned {
  border-style: dashed;
}

.arch-dot {
  position: absolute;
  right: 16px;
  top: 18px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px var(--accent);
}

.arch-name {
  font-size: 16px;
  font-weight: 700;
  padding-right: 18px;
}

.arch-sub {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text-2);
}

.arch-status {
  margin-top: 6px;
  justify-self: start;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--text-2);
  border: 1px solid var(--line-strong);
}

.arch-go {
  position: absolute;
  right: 16px;
  bottom: 14px;
  font-size: 14px;
  color: var(--text-3);
}

.flow :deep(.vue-flow__edge-path) {
  stroke: rgba(143, 179, 255, 0.55);
  stroke-width: 1.6;
}

.flow :deep(.vue-flow__edge.is-planned .vue-flow__edge-path) {
  stroke: rgba(244, 114, 182, 0.6);
  stroke-dasharray: 6 6;
  animation: none;
}

.flow :deep(.vue-flow__edge-textbg) {
  fill: #0b0d15;
}

.flow :deep(.vue-flow__edge-text) {
  fill: rgba(235, 238, 255, 0.7);
  font-size: 11px;
}

.flow :deep(.vue-flow__handle) {
  opacity: 0;
  pointer-events: none;
}

.flow :deep(.vue-flow__node) {
  border: 0;
  background: transparent;
  padding: 0;
}

.flow :deep(.vue-flow__controls) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid var(--line-strong);
}

.flow :deep(.vue-flow__controls-button) {
  background: rgba(16, 18, 28, 0.95);
  border-bottom: 1px solid var(--line);
  fill: var(--text-2);
  color: var(--text-2);
}

.flow :deep(.vue-flow__controls-button svg) {
  fill: currentColor;
}

.flow :deep(.vue-flow__controls-button:hover) {
  background: rgba(30, 34, 48, 0.95);
}
</style>
