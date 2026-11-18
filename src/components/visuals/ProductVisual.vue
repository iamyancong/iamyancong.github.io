<script setup lang="ts">
import type { ProductId } from '@/data/products'
import TerminalDemo from './TerminalDemo.vue'

defineProps<{ id: ProductId }>()

const deploySteps = ['拉取模板', '变量替换', 'Git 初始化', '推送', '建仓']
const tableRows = [
  ['订单中心', '已上线', 92],
  ['数据中台', '联调中', 64],
  ['审批流', '开发中', 38],
  ['报表平台', '已上线', 100],
] as const
</script>

<template>
  <div class="visual" :data-id="id">
    <!-- YSS UI：拟真表格 -->
    <div v-if="id === 'yss-ui'" class="v-table" aria-hidden="true">
      <div class="v-row v-head"><span>应用</span><span>状态</span><span>进度</span></div>
      <div v-for="row in tableRows" :key="row[0]" class="v-row">
        <span>{{ row[0] }}</span>
        <span class="v-chip">{{ row[1] }}</span>
        <span class="v-bar"><i :style="{ width: `${row[2]}%` }" /></span>
      </div>
      <p class="v-caption">示意画面</p>
    </div>

    <!-- AI 套件：MCP 查询 -->
    <div v-else-if="id === 'ai-kit'" class="v-ai" aria-hidden="true">
      <div class="bubble q">写一个带新增/编辑/查看三态的表单页</div>
      <div class="tool"><span class="mono">get_demo</span> formily/modes</div>
      <div class="tool"><span class="mono">search_docs</span> 编辑表单回显</div>
      <div class="bubble a">已按 page-form-module 规范生成 ✓</div>
    </div>

    <!-- 脚手架：终端 -->
    <TerminalDemo
      v-else-if="id === 'create-yss-app'"
      command="npm create yss-app@latest"
      :lines="['? 应用中文名  订单中心', '? 应用英文名  order-center', '✔ 激活路由 / 端口 / 接口前缀已推导', '✔ @yss-ui/* 已对齐最新版']"
    />

    <!-- 模板：目录树 -->
    <pre v-else-if="id === 'microapp-template'" class="v-tree mono" aria-hidden="true">packages/src/
├── api/generated/   <em>Orval</em>
├── views/Order/
│   ├── index.vue
│   ├── type.ts
│   ├── hooks/
│   └── components/
├── router/
└── main.ts          <em>qiankun 生命周期</em></pre>

    <!-- 雨燕：发布进度 -->
    <div v-else-if="id === 'yuyan'" class="v-steps" aria-hidden="true">
      <div v-for="(step, i) in deploySteps" :key="step" class="v-step" :style="{ '--d': `${i * 0.6}s` }">
        <span class="v-step-dot" />
        <span>{{ step }}</span>
      </div>
      <p class="v-caption">创建微应用 · 流式进度</p>
    </div>

    <!-- SwiftVPN：公司网络内直连，外网时经 VPN 接入内网 -->
    <svg v-else-if="id === 'swiftvpn'" class="v-vpn" viewBox="0 0 320 180" aria-hidden="true">
      <circle cx="40" cy="42" r="14" class="node b" />
      <text x="40" y="74" class="lbl">公司网络内</text>
      <circle cx="40" cy="130" r="14" class="node a" />
      <text x="40" y="162" class="lbl">公司网络外</text>
      <circle cx="276" cy="86" r="18" class="node res" />
      <text x="276" y="124" class="lbl">内网研发资源</text>
      <path d="M54 42 C150 42 200 78 258 84" class="line direct" />
      <path d="M54 130 C150 130 200 96 258 90" class="line a" />
      <text x="146" y="34" class="tag">直连 · 无需 VPN</text>
      <rect x="132" y="112" width="26" height="20" rx="5" class="lock" />
      <path d="M139 112 v-5 a6 6 0 0 1 12 0 v5" class="lock-arc" />
      <text x="146" y="152" class="tag">连接 SwiftVPN</text>
    </svg>

    <!-- qiankun：嵌套容器 -->
    <div v-else-if="id === 'qiankun'" class="v-nest" aria-hidden="true">
      <span class="nest-label">主应用</span>
      <div class="nest-grid">
        <div class="nest-child">子应用 /order</div>
        <div class="nest-child">子应用 /report</div>
        <div class="nest-child">子应用 /approval</div>
      </div>
    </div>

    <!-- 移动端：手机框 -->
    <div v-else class="v-phone" aria-hidden="true">
      <div class="phone">
        <div class="phone-notch" />
        <div class="phone-line w60" />
        <div class="phone-line w90" />
        <div class="phone-card" />
        <div class="phone-line w40" />
      </div>
      <span class="nest-label">H5 · App · 小程序</span>
    </div>
  </div>
</template>

<style scoped>
.visual {
  width: 100%;
}

.v-caption {
  margin: 10px 0 0;
  font-size: 11px;
  color: var(--text-3);
}

.v-table {
  font-size: 13px;
}

.v-row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
}

.v-head {
  color: var(--text-3);
  font-size: 12px;
}

.v-chip {
  justify-self: start;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 11px;
  background: rgba(79, 124, 255, 0.16);
  color: #b9cbff;
}

.v-bar {
  height: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.v-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--grad);
}

.v-ai {
  display: grid;
  gap: 8px;
  font-size: 13px;
}

.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  max-width: 88%;
}

.bubble.q {
  justify-self: end;
  background: rgba(139, 92, 246, 0.22);
}

.bubble.a {
  background: rgba(52, 211, 153, 0.14);
  color: #a7f3d0;
}

.tool {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px dashed var(--line-strong);
  color: var(--text-2);
  font-size: 12px;
}

.tool .mono {
  color: var(--cyan);
  margin-right: 6px;
}

.v-tree {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.75;
  color: var(--text-2);
}

.v-tree em {
  font-style: normal;
  color: var(--cyan);
}

.v-steps {
  display: grid;
  gap: 10px;
}

.v-step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-2);
  animation: step-on 3.6s var(--d) infinite;
}

.v-step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid var(--green);
}

@keyframes step-on {
  0%,
  10% {
    color: var(--text-3);
  }

  25%,
  85% {
    color: var(--text);
  }
}

.v-step:nth-child(n) .v-step-dot {
  animation: dot-on 3.6s var(--d) infinite;
}

@keyframes dot-on {
  0%,
  10% {
    background: transparent;
  }

  25%,
  85% {
    background: var(--green);
    box-shadow: 0 0 10px var(--green);
  }
}

.v-vpn {
  width: 100%;
}

.v-vpn .node {
  fill: rgba(255, 255, 255, 0.08);
  stroke: rgba(255, 255, 255, 0.5);
}

.v-vpn .node.a {
  stroke: #f59e0b;
}

.v-vpn .node.b {
  stroke: #22d3ee;
}

.v-vpn .line {
  fill: none;
  stroke-width: 2;
  stroke-dasharray: 6 8;
  animation: flow 1.4s linear infinite;
}

.v-vpn .line.a {
  stroke: #f59e0b;
}

.v-vpn .line.direct {
  stroke: #22d3ee;
  stroke-dasharray: none;
  animation: none;
  opacity: 0.7;
}

.v-vpn .node.res {
  stroke: rgba(143, 179, 255, 0.9);
  fill: rgba(79, 124, 255, 0.16);
}

.v-vpn .lock {
  fill: rgba(245, 158, 11, 0.2);
  stroke: #f59e0b;
}

.v-vpn .lock-arc {
  fill: none;
  stroke: #f59e0b;
  stroke-width: 1.6;
}

.v-vpn .lbl,
.v-vpn .tag {
  fill: rgba(235, 238, 255, 0.6);
  font-size: 11px;
  text-anchor: middle;
}

@keyframes flow {
  to {
    stroke-dashoffset: -28;
  }
}

.v-nest {
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  padding: 12px;
}

.nest-label {
  font-size: 12px;
  color: var(--text-3);
}

.nest-grid {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.nest-child {
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  background: rgba(167, 139, 250, 0.14);
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.v-phone {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.phone {
  width: 120px;
  height: 200px;
  border-radius: 22px;
  border: 1.5px solid var(--line-strong);
  padding: 22px 12px 12px;
  display: grid;
  align-content: start;
  gap: 8px;
  position: relative;
  background: rgba(244, 114, 182, 0.06);
}

.phone-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 36px;
  height: 6px;
  border-radius: 6px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.18);
}

.phone-line {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
}

.w40 {
  width: 40%;
}

.w60 {
  width: 60%;
}

.w90 {
  width: 90%;
}

.phone-card {
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.4), rgba(139, 92, 246, 0.3));
}
</style>
