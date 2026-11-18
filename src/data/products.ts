/**
 * 官网唯一的内容事实来源。
 * 规则：只写已核实的事实（仓库 README / package.json / GitHub Release / npm），
 * 不编造任何数字；不写内网地址、网关、密码等信息。
 */

export type ProductId =
  | 'yss-ui'
  | 'ai-kit'
  | 'create-yss-app'
  | 'microapp-template'
  | 'yuyan'
  | 'swiftvpn'
  | 'qiankun'
  | 'mobile'

export type ProductStatus = 'live' | 'open-source' | 'research'

/** chain：研发交付链路上的产品；infra：研发基础设施，独立于链路之外 */
export type ProductGroup = 'chain' | 'infra'

export const GROUP_LABEL: Record<ProductGroup, string> = {
  chain: '研发交付链路',
  infra: '研发基础设施 · 独立工具',
}

export interface ProductLink {
  label: string
  href: string
}

export interface Product {
  id: ProductId
  name: string
  short: string
  eyebrow: string
  tagline: string
  summary: string
  status: ProductStatus
  group: ProductGroup
  /** 主题强调色，仅用于装饰 */
  accent: string
  capabilities: { title: string; detail: string }[]
  stack: string[]
  facts: { label: string; value: string }[]
  links: ProductLink[]
  commands?: string[]
}

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: '已发布',
  'open-source': '开源方案',
  research: '调研中',
}

export const products: Product[] = [
  {
    id: 'yss-ui',
    name: 'YSS UI',
    short: 'YSS UI',
    eyebrow: 'Component System',
    tagline: '企业级中后台组件库，整个体系的底座。',
    summary: '基于 Vue 3、Ant Design Vue 与 VXE-Table 的企业级中后台组件库，内置表格、表单、主题与 Hooks 最佳实践。',
    status: 'live',
    group: 'chain',
    accent: '#4f7cff',
    capabilities: [
      { title: '大数据表格', detail: 'YTable / YEditTable：虚拟滚动、服务端分页、行拖拽排序、单元格动态校验与行内编辑。' },
      { title: '动态表单', detail: 'YFormily：JSON Schema 驱动、字段级联动、新增 / 编辑 / 查看三态切换。' },
      { title: '自适应布局 Hooks', detail: 'useTableHeight、useTreeHeight 等，解决中后台嵌套布局的双滚动条与高度塌陷。' },
      { title: '动态主题 Token', detail: '@yss-ui/theme：Design Token 派生、CSS 变量映射、暗色模式与品牌色切换。' },
    ],
    stack: ['Vue 3', 'TypeScript', 'Vite', 'Formily 2', 'vxe-table 4', 'pnpm Monorepo', 'dumi', 'Vitest'],
    facts: [
      { label: '@yss-ui/components', value: '1.11.1' },
      { label: '@yss-ui/hooks', value: '1.2.1' },
      { label: '@yss-ui/theme', value: '1.0.3' },
      { label: '@yss-ui/utils', value: '1.0.6' },
      { label: '工程', value: 'GitHub Actions 质量门禁与自动发版' },
      { label: '协议', value: 'MIT' },
    ],
    links: [
      { label: '在线文档', href: 'https://iamyancong.github.io/yss-ui/' },
      { label: 'GitHub', href: 'https://github.com/iamyancong/yss-ui' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@yss-ui/components' },
    ],
  },
  {
    id: 'ai-kit',
    name: 'AI 研发套件',
    short: 'AI Kit',
    eyebrow: 'MCP · Skills · llms.txt',
    tagline: '让 Coding Agent 查阅为先、按规范生成代码。',
    summary: '把组件文档、官方 Demo 和业务开发规范交给 AI 工具按需查询，不靠模型记忆猜组件配置。',
    status: 'live',
    group: 'chain',
    accent: '#8b5cf6',
    capabilities: [
      { title: '@yss-ui/mcp', detail: 'MCP Server，离线索引组件 API、171+ 官方 Demo 与 30+ Skills，零网络、确定性输出。' },
      { title: '一键接入 12 个 AI 工具', detail: 'Cursor、Antigravity、Claude、Codex、Trae 等，安装器只增改 yss-ui 一个条目。' },
      { title: '@yss-ui/skills', detail: 'CRUD、Formily 联动、表格、主题、创建微应用等业务开发规范。' },
      { title: 'llms.txt', detail: '导出 llms.txt / llms-full.txt，可直接投喂大模型。' },
    ],
    stack: ['Model Context Protocol', 'Node.js', 'Skills', 'llms.txt'],
    facts: [
      { label: '@yss-ui/mcp', value: '0.10.1' },
      { label: '@yss-ui/skills', value: '1.11.0' },
      { label: '@yss-ui/skills-cli', value: '1.1.2' },
      { label: '端到端验证', value: 'GSSR 内部项目验证需求到页面打通，结论待补充' },
    ],
    links: [
      { label: 'MCP 文档', href: 'https://iamyancong.github.io/yss-ui/guide/mcp' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@yss-ui/mcp' },
      { label: 'llms-full.txt', href: 'https://iamyancong.github.io/yss-ui/llms-full.txt' },
    ],
    commands: ['npx -y @yss-ui/mcp install', 'npx -y @yss-ui/skills-cli sync'],
  },
  {
    id: 'create-yss-app',
    name: 'create-yss-app',
    short: '脚手架',
    eyebrow: 'Scaffolding CLI',
    tagline: '一条命令，生成标准微应用。',
    summary: '在本地生成 Vue 3 + TypeScript + Vite + qiankun 微前端子应用骨架，源码在 yss-ui 仓库的 packages/create。',
    status: 'live',
    group: 'chain',
    accent: '#22d3ee',
    capabilities: [
      { title: '自动推导', detail: '只填中英文名，激活路由、端口、接口前缀、代理目标自动推导并标注来源。' },
      { title: '面向 CI 与 AI Agent', detail: '--dry-run --json 预检，--plan-out / --apply 先出计划再执行。' },
      { title: '版本对齐', detail: '自动把 @yss-ui/* 对齐到 registry 最新版，并处理镜像同步延迟。' },
      { title: '与 Skill 同源', detail: '和 yss-create-microapp Skill 共用同一份核心代码，同参数生成结果逐文件一致。' },
    ],
    stack: ['Node.js', 'CLI', 'Vue 3', 'qiankun'],
    facts: [
      { label: '@yss-ui/create', value: '1.3.2' },
      { label: 'create-yss-app', value: '1.3.2' },
      { label: '默认模板', value: 'iamyancong/microapp-template-vue3' },
    ],
    links: [
      { label: 'CLI 文档', href: 'https://iamyancong.github.io/yss-ui/guide/create-app' },
      { label: 'npm', href: 'https://www.npmjs.com/package/create-yss-app' },
      { label: '源码', href: 'https://github.com/iamyancong/yss-ui/tree/main/packages/create' },
    ],
    commands: ['npm create yss-app@latest'],
  },
  {
    id: 'microapp-template',
    name: 'microapp-template-vue3',
    short: '微应用模板',
    eyebrow: 'Micro-App Template',
    tagline: '可接入、可独立运行的微应用模板。',
    summary: '脚手架与雨燕默认使用的 Vue 3 微应用模板，既能作为 qiankun 子应用接入，也能独立运行。',
    status: 'live',
    group: 'chain',
    accent: '#38bdf8',
    capabilities: [
      { title: '类型安全接口', detail: 'OpenAPI + Orval 自动生成类型安全的 API 客户端。' },
      { title: '模块化目录规范', detail: '页面、类型、常量、Hooks、私有组件按模块组织，ESLint 架构拦截。' },
      { title: 'Mock 与主题', detail: '内置 Mock 服务与主题 Token，支持高密度业务界面。' },
      { title: '稳健基线', detail: '长整型精度处理与 Chrome 90 兼容基线。' },
    ],
    stack: ['Vue 3', 'TypeScript', 'Vite', 'qiankun', 'YSS UI', 'Ant Design Vue', 'Pinia', 'vue-i18n'],
    facts: [
      { label: '工程', value: 'ESLint 架构拦截 · GitHub Actions CI · Dockerfile' },
      { label: '协议', value: 'MIT' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/iamyancong/microapp-template-vue3' }],
  },
  {
    id: 'yuyan',
    name: '雨燕 Yuyan',
    short: '雨燕平台',
    eyebrow: 'DevOps Desktop',
    tagline: '微应用脚手架 + 运维部署，一个客户端搞定。',
    summary: '面向前端团队的桌面端一站式工具，把创建微应用、仓库管理、发布与 Nginx 管理整合到一个本地客户端。',
    status: 'live',
    group: 'chain',
    accent: '#34d399',
    capabilities: [
      { title: '创建微应用', detail: '拉取模板、变量替换、Git 初始化、建仓推送，NDJSON 流式回传进度。' },
      { title: '部署中心', detail: '本地构建、SSH 上传、Nginx 站点管理、版本备份与一键回滚、托管式 Nginx 运行时。' },
      { title: '平台应用与仓库', detail: '查看平台微应用的代码与配置，浏览和批量运维仓库。' },
      { title: 'AI 控制平面', detail: 'Codex、Cursor、Antigravity 通过本地 stdio MCP 调用雨燕，写操作带差异预览、审批与审计链。' },
    ],
    stack: ['Tauri 2', 'Vue 3', 'Node.js（Express）', 'SQLite', 'ssh2', 'YSS UI'],
    facts: [
      { label: '最新版本', value: 'v1.3.26（2026-11-17）' },
      { label: '平台', value: 'macOS（Apple 芯片 / Intel）· Windows' },
      { label: '协议', value: 'MIT' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/iamyancong/yuyan' },
      { label: '下载', href: 'https://github.com/iamyancong/yuyan/releases' },
    ],
  },
  {
    id: 'qiankun',
    name: 'qiankun 微前端',
    short: 'qiankun',
    eyebrow: 'Open-Source Runtime',
    tagline: 'PC 端微前端直接采用开源 qiankun。',
    summary: '不自研基座，业务微应用以 qiankun 子应用接入主应用。qiankun 是蚂蚁开源的微前端方案。',
    status: 'open-source',
    group: 'chain',
    accent: '#a78bfa',
    capabilities: [
      { title: '基于 single-spa', detail: '主应用按激活路由加载子应用。' },
      { title: '隔离', detail: '提供 JS 沙箱与样式隔离。' },
      { title: '通信与预加载', detail: '应用间通信与资源预加载。' },
      { title: '在体系中', detail: '模板与脚手架生成的项目默认是 qiankun 子应用，也能独立运行；雨燕创建时自动推导激活路由。' },
    ],
    stack: ['qiankun', 'single-spa'],
    facts: [{ label: '性质', value: '开源方案，非自研' }],
    links: [
      { label: 'GitHub', href: 'https://github.com/umijs/qiankun' },
      { label: '文档', href: 'https://qiankun.umijs.org/zh' },
    ],
  },
  {
    id: 'mobile',
    name: '移动端 mobile-starter',
    short: '移动端',
    eyebrow: 'Mobile · In Research',
    tagline: '一套代码覆盖 H5、App 与小程序。',
    summary: '覆盖 H5、Capacitor App 与微信小程序 web-view 壳，未来拆出移动端微应用模板，并在雨燕「创建微应用」中支持。',
    status: 'research',
    group: 'chain',
    accent: '#f472b6',
    capabilities: [
      { title: '三端一体', detail: 'H5、Capacitor App 与小程序 web-view 壳共用一套页面。' },
      { title: 'nginx 发布', detail: '与 PC 一样，独立 H5 打包后按路径前缀部署，不使用 qiankun。' },
      { title: '容器内页面', detail: 'H5 本质是嵌入 Capacitor App 或小程序 web-view 的页面。' },
      { title: '移动端表单', detail: '表单优先 Schema 渲染，配套 @yss-ui/mobile-formily（未发布）。' },
    ],
    stack: ['Vue 3', 'Vant 4', 'Capacitor', '小程序 web-view', '@yss-ui/mobile-formily'],
    facts: [
      { label: '状态', value: '本地调研中，暂无公开仓库' },
      { label: '下一步', value: '拆出移动端微应用模板，雨燕支持创建' },
    ],
    links: [],
  },
  {
    id: 'swiftvpn',
    name: '雨燕 SwiftVPN',
    short: 'SwiftVPN',
    eyebrow: 'Remote Access Client',
    tagline: '人在公司网络之外，也能接入内网研发资源。',
    summary:
      '连接公司内网的桌面客户端。在公司有线或无线网络内不需要它；身处公司网络之外、需要访问内网研发资源时再连接。它是独立的接入工具，不属于组件库与研发交付链路。',
    status: 'live',
    group: 'infra',
    accent: '#f59e0b',
    capabilities: [
      { title: '按需连接', detail: '在公司网络内直接访问内网，无需开启；在外网需要访问内网时一键连接，用完即断。' },
      { title: '多通道并行', detail: '支持 Fortinet 与 aTrust 两类接入同时连接，可独立启停或一键全部断开。' },
      { title: '智能分流', detail: '只有内网流量走 VPN，其余流量照常直连，不改写系统代理；接口与路由都就绪才显示已连接。' },
      { title: '凭证保护', detail: '提权凭证只在内存暂存、不落盘；内嵌验证码与二次认证输入。' },
      { title: '自动更新', detail: '内置版本检测、断点续传与热重启更新。' },
    ],
    stack: ['Tauri 2（Rust）', 'Vue 3', 'Vite 7', 'openfortivpn', 'zju-connect'],
    facts: [
      { label: '定位', value: '研发基础设施 · 外网接入内网的桌面客户端' },
      { label: '何时需要', value: '仅在公司网络之外访问内网时使用' },
      { label: '最新版本', value: 'v1.0.25（2026-11-10）' },
      { label: '平台', value: 'macOS（Apple 芯片 / Intel）· Windows · Linux 规划中' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/iamyancong/yuyan-vpn' },
      { label: '下载', href: 'https://github.com/iamyancong/yuyan-vpn/releases' },
    ],
  },
]

export const productMap = Object.fromEntries(products.map((p) => [p.id, p])) as Record<ProductId, Product>

export type GraphNodeId = ProductId | 'deploy'

export interface Relation {
  from: GraphNodeId
  to: GraphNodeId
  label: string
  planned?: boolean
}

export const relations: Relation[] = [
  { from: 'yss-ui', to: 'ai-kit', label: '文档与规范索引' },
  { from: 'yss-ui', to: 'microapp-template', label: '组件依赖' },
  { from: 'yss-ui', to: 'yuyan', label: '组件依赖' },
  { from: 'ai-kit', to: 'create-yss-app', label: 'Skill 调用' },
  { from: 'create-yss-app', to: 'microapp-template', label: '拉取模板' },
  { from: 'microapp-template', to: 'yuyan', label: '远程模板' },
  { from: 'qiankun', to: 'microapp-template', label: '子应用运行时' },
  { from: 'yuyan', to: 'deploy', label: 'Nginx 发布' },
  { from: 'yss-ui', to: 'mobile', label: 'mobile-formily', planned: true },
  { from: 'mobile', to: 'yuyan', label: '创建微应用支持', planned: true },
]

export function upstreamOf(id: ProductId) {
  return relations.filter((r) => r.to === id && r.from !== 'deploy').map((r) => ({ relation: r, product: productMap[r.from as ProductId] }))
}

export function downstreamOf(id: ProductId) {
  return relations
    .filter((r) => r.from === id && r.to !== 'deploy')
    .map((r) => ({ relation: r, product: productMap[r.to as ProductId] }))
}

/** 体系全景的分层叙事（首页粘性舞台） */
export const layers = [
  { id: 'yss-ui', title: '组件库', name: 'YSS UI', detail: '组件、Hooks、主题 Token 与开发规范' },
  { id: 'ai-kit', title: 'AI 研发套件', name: 'MCP · Skills', detail: '让 AI 查阅为先、按规范生成' },
  { id: 'create-yss-app', title: '脚手架', name: 'create-yss-app', detail: '一条命令生成标准微应用' },
  { id: 'microapp-template', title: '微应用模板', name: 'microapp-template-vue3', detail: 'qiankun 子应用，可独立运行' },
  { id: 'yuyan', title: '研发运维平台', name: '雨燕 Yuyan', detail: '创建、建仓、发布、回滚' },
  { id: 'deploy', title: '部署', name: 'Nginx', detail: '按路径前缀发布，版本可回滚' },
] as const

export const chainSteps = [
  { title: '组件与规范沉淀在 yss-ui', detail: '组件、Hooks、主题 Token 与业务开发规范在一个 Monorepo 里维护，经 GitHub Actions 门禁后发到 npm。' },
  { title: '脚手架一键建项', detail: 'npm create yss-app@latest 拉取模板，自动推导路由、端口与接口前缀，并把 @yss-ui/* 对齐到最新版。' },
  { title: '在雨燕里创建并建仓', detail: '雨燕「创建微应用」基于同一模板生成项目，完成 Git 初始化、建仓推送并打上平台标签。' },
  { title: '按模板规范开发', detail: 'OpenAPI 生成接口、模块化目录、Mock 联调；AI IDE 通过 MCP 与 Skills 按同一套规范生成页面。' },
  { title: '部署中心发布', detail: '构建、上传、写入并重载 Nginx 配置，每次发布保留版本，可一键回滚。' },
  { title: '运行', detail: 'PC 端由开源 qiankun 主应用按激活路由加载子应用；移动端 H5 同样经 nginx 按路径前缀发布，嵌入 Capacitor App 或小程序 web-view。' },
] as const

export type RoadmapPhase = 'near' | 'mid' | 'far'

export const roadmap: Record<RoadmapPhase, { label: string; items: { title: string; detail: string; status: string }[] }> = {
  near: {
    label: '近期',
    items: [
      { title: '官网与架构全景', detail: '统一介绍各产品并互相跳转。', status: '进行中' },
      { title: '研发规范内建', detail: '代码规范、目录约定、请求封装、发布流程落进模板、脚手架与 lint。', status: '规划中' },
      { title: 'mobile-starter 架构初版', detail: '@yss-ui/mobile-formily 同步定稿。', status: '调研中' },
      { title: 'SwiftVPN Linux 支持', detail: '方案评审通过后开发。', status: '待评审' },
    ],
  },
  mid: {
    label: '中期',
    items: [
      { title: '移动端微应用模板', detail: '从 mobile-starter 拆出，独立 H5 + nginx 路径前缀部署。', status: '规划中' },
      { title: '雨燕支持创建移动端微应用', detail: '复用现有表单，激活路由前缀即 nginx 部署路径。', status: '规划中' },
      { title: 'PC / 移动端模板统一约定', detail: '目录、请求、权限、发布、AI Skills 接入方式两端一致。', status: '规划中' },
      { title: '效能度量采集', detail: '接入数、建项耗时、组件复用率、构建发布耗时。', status: '规划中' },
    ],
  },
  far: {
    label: '远期',
    items: [
      { title: '需求到页面 AI 链路产品化', detail: '把端到端验证的结论沉淀为团队标准流程。', status: '规划中' },
      { title: '移动端真机预览与打包', detail: 'H5 预览包与 Capacitor Android 构建。', status: '待 mobile-starter 成熟' },
      { title: '内网项目 CI 构建', detail: '内网项目按需接入构建机，开源项目继续走 GitHub Actions。', status: '规划中' },
    ],
  },
}
