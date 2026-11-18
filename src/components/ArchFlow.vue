<script setup lang="ts">
import { Background } from '@vue-flow/background'
import {
  BaseEdge,
  Handle,
  MarkerType,
  Position,
  useVueFlow,
  VueFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeMouseEvent,
} from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GROUP_LABEL, productMap, relations, STATUS_LABEL, type GraphNodeId, type ProductId } from '@/data/products'

withDefaults(defineProps<{ height?: string }>(), { height: 'auto' })

const router = useRouter()
const { fitView, zoomIn, zoomOut } = useVueFlow()
const box = ref<HTMLElement | null>(null)

/** fitView 留白尽量小，让节点铺满画布 */
const FIT = { padding: 0.035 }
let ro: ResizeObserver | undefined

function onReady() {
  void fitView(FIT)
  // 全景图挂载后页面高度可能变化，通知滚动动画重新测量
  void import('@/motion/gsap').then(({ ScrollTrigger }) => ScrollTrigger.refresh())
}

onMounted(() => {
  if (!box.value || typeof ResizeObserver === 'undefined') return
  ro = new ResizeObserver(() => void fitView(FIT))
  ro.observe(box.value)
})
onBeforeUnmount(() => ro?.disconnect())

/**
 * 网格布局（列 × 行），长宽比约 2.15:1，与画布比例一致，fitView 后几乎没有空边。
 *   行 0：AI 研发套件 → create-yss-app            Nginx 部署
 *   行 1：YSS UI ──→ 微应用模板 ──→ 雨燕 Yuyan（主干）
 *   行 2：[研发基础设施：SwiftVPN]  qiankun        移动端（规划）
 */
const COL = 340
const ROW = 230
const NODE_W = 260
const GRID: Record<GraphNodeId, [number, number]> = {
  'ai-kit': [1, 0],
  'create-yss-app': [2, 0],
  deploy: [3, 0],
  'yss-ui': [0, 1],
  'microapp-template': [2, 1],
  yuyan: [3, 1],
  swiftvpn: [0, 2],
  qiankun: [1, 2],
  mobile: [3, 2],
}

/** 非默认走线：竖向连接与绕行通道 */
const ROUTES: Record<string, { sourceHandle?: string; targetHandle?: string; lane?: number }> = {
  'create-yss-app-microapp-template': { sourceHandle: 's-b', targetHandle: 't-t' },
  'qiankun-microapp-template': { targetHandle: 't-b' },
  // 从顶部分出，避开下方的绕行通道
  'yss-ui-ai-kit': { sourceHandle: 's-t' },
  'yuyan-deploy': { sourceHandle: 's-t', targetHandle: 't-b' },
  'mobile-yuyan': { sourceHandle: 's-t', targetHandle: 't-b' },
  // YSS UI → 雨燕：走第 0、1 行之间的通道，不从微应用模板背后穿过
  'yss-ui-yuyan': { lane: ROW * 0.74 },
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

const pos = (id: GraphNodeId) => ({ x: GRID[id][0] * COL, y: GRID[id][1] * ROW })

const productNodes: Node<NodeData>[] = (Object.keys(GRID) as GraphNodeId[]).map((id) => {
  if (id === 'deploy') {
    return {
      id,
      type: 'arch',
      position: pos(id),
      data: { id, name: 'Nginx 部署', sub: '按路径前缀发布 · 可回滚', accent: '#94a3b8', clickable: false },
    }
  }
  const p = productMap[id]
  return {
    id,
    type: 'arch',
    position: pos(id),
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

// 研发基础设施分组框：SwiftVPN 独立于交付链路，没有任何连线
const zone: Node = {
  id: 'zone-infra',
  type: 'zone',
  position: { x: pos('swiftvpn').x - 22, y: pos('swiftvpn').y - 50 },
  data: { label: GROUP_LABEL.infra },
  zIndex: -1,
  selectable: false,
  draggable: false,
  focusable: false,
  style: { width: `${NODE_W + 44}px`, height: '212px' },
}

const nodes: Node[] = [zone, ...productNodes]

const edges: Edge[] = relations.map((r) => {
  const key = `${r.from}-${r.to}`
  const route = ROUTES[key] ?? {}
  const color = r.planned ? 'rgba(244,114,182,0.75)' : 'rgba(143,179,255,0.85)'
  return {
    id: key,
    source: r.from,
    target: r.to,
    sourceHandle: route.sourceHandle ?? 's-r',
    targetHandle: route.targetHandle ?? 't-l',
    label: r.label,
    type: route.lane === undefined ? 'default' : 'lane',
    data: { lane: route.lane },
    animated: !r.planned,
    class: r.planned ? 'is-planned' : '',
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color },
  }
})

/** 通道走线：水平出发 → 过渡到通道高度 → 沿通道 → 过渡回目标高度 */
function lanePath(e: EdgeProps) {
  const lane = (e.data as { lane: number }).lane
  const { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty } = e
  const r = 46
  const d = [
    `M ${sx},${sy}`,
    `C ${sx + r},${sy} ${sx + r},${lane} ${sx + r * 2},${lane}`,
    `L ${tx - r * 2},${lane}`,
    `C ${tx - r},${lane} ${tx - r},${ty} ${tx},${ty}`,
  ].join(' ')
  return { d, x: (sx + tx) / 2, y: lane }
}

function onNodeClick({ node }: NodeMouseEvent) {
  if (node.type !== 'arch') return
  const data = node.data as NodeData
  if (data.clickable) void router.push(`/products/${data.id as ProductId}`)
}
</script>

<template>
  <div class="flow-root">
    <div ref="box" class="flow" :style="height === 'auto' ? undefined : { height }">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :fit-view-on-init="false"
        :min-zoom="0.2"
        :max-zoom="1.6"
        :zoom-on-scroll="false"
        :pan-on-scroll="false"
        :prevent-scrolling="false"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :elements-selectable="false"
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
            <Handle id="t-l" type="target" :position="Position.Left" :connectable="false" />
            <Handle id="t-t" type="target" :position="Position.Top" :connectable="false" />
            <Handle id="t-b" type="target" :position="Position.Bottom" :connectable="false" />
            <Handle id="s-r" type="source" :position="Position.Right" :connectable="false" />
            <Handle id="s-t" type="source" :position="Position.Top" :connectable="false" />
            <Handle id="s-b" type="source" :position="Position.Bottom" :connectable="false" />
            <span class="arch-dot" />
            <span class="arch-name">{{ data.name }}</span>
            <span class="arch-sub">{{ data.sub }}</span>
            <span v-if="data.status" class="arch-status">{{ data.status }}</span>
            <span v-if="data.clickable" class="arch-go" aria-hidden="true">→</span>
          </div>
        </template>
        <template #node-zone="{ data }">
          <div class="zone">
            <span class="zone-label">{{ data.label }}</span>
          </div>
        </template>
        <template #edge-lane="edge">
          <BaseEdge
            :id="edge.id"
            :path="lanePath(edge).d"
            :marker-end="edge.markerEnd"
            :label="edge.label"
            :label-x="lanePath(edge).x"
            :label-y="lanePath(edge).y"
          />
        </template>
        <Background pattern-color="rgba(255,255,255,0.07)" :gap="28" />
      </VueFlow>
    </div>
    <div class="flow-foot">
      <p class="flow-hint">拖拽平移 · 点击节点进入产品页 · 虚线为规划中 · 虚线框为独立的研发基础设施</p>
      <div class="flow-ctrl" role="group" aria-label="缩放全景图">
        <button type="button" aria-label="缩小" @click="zoomOut()">−</button>
        <button type="button" aria-label="放大" @click="zoomIn()">+</button>
        <button type="button" aria-label="适应画布" @click="fitView(FIT)">适应</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow {
  position: relative;
  width: 100%;
  /* 与布局长宽比一致：画布随容器等比缩放，节点始终铺满 */
  aspect-ratio: 2.15;
  min-height: 420px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    radial-gradient(ellipse at 20% 0%, rgba(79, 124, 255, 0.12), transparent 60%),
    radial-gradient(ellipse at 90% 100%, rgba(139, 92, 246, 0.12), transparent 60%),
    rgba(255, 255, 255, 0.015);
  overflow: hidden;
}

.flow-foot {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.flow-ctrl {
  display: flex;
  gap: 6px;
}

.flow-ctrl button {
  min-width: 34px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.2s var(--ease),
    color 0.2s var(--ease);
}

.flow-ctrl button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.flow-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-3);
  pointer-events: none;
}

.arch-node {
  position: relative;
  width: 260px;
  min-height: 112px;
  padding: 16px 18px 14px;
  border-radius: 18px;
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
  font-size: 19px;
  letter-spacing: -0.01em;
  font-weight: 700;
  padding-right: 18px;
}

.arch-sub {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-2);
}

.arch-status {
  margin-top: 6px;
  justify-self: start;
  font-size: 12px;
  padding: 2px 9px;
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
  stroke: rgba(143, 179, 255, 0.6);
  stroke-width: 1.8;
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
  fill: rgba(235, 238, 255, 0.78);
  font-size: 13px;
}

.zone {
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(245, 158, 11, 0.45);
  border-radius: 24px;
  background: rgba(245, 158, 11, 0.04);
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.zone-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(252, 211, 77, 0.9);
}


.flow :deep(.vue-flow__node-zone) {
  pointer-events: none;
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




</style>
