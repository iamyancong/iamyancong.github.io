# 王彦聪 · 前端研发体系官网

线上地址：<https://iamyancong.github.io/>

这个站点是前端研发体系的统一门面：用一张全景图串起 YSS UI 组件库、AI 研发套件、create-yss-app 脚手架、微应用模板、雨燕 Yuyan 研发运维平台、雨燕 SwiftVPN、qiankun 微前端与移动端方案，并提供每个产品的详情页与演进路线。

组件库文档仍在 [YSS UI 文档站](https://iamyancong.github.io/yss-ui/)，两边互相跳转。

## 技术栈

| 方面 | 选型 |
| --- | --- |
| 框架 | Vue 3 + TypeScript + Vite |
| 静态生成 | vite-ssg（每个路由预渲染为独立 HTML，利于 SEO 与首屏） |
| 动效 | GSAP（ScrollTrigger / SplitText）+ Lenis 平滑滚动 |
| 3D | TresJS + three.js（首屏雨燕粒子，懒加载） |
| 全景图 | Vue Flow（节点可点击进入产品页） |
| 部署 | GitHub Actions → GitHub Pages（用户站根路径） |

## 目录结构

```text
src/
  data/          站点与产品的唯一事实来源（products.ts / site.ts）
  motion/        动效分级、GSAP 注册、Lenis 平滑滚动、按分级执行动画的组合式函数
  three/         首屏 3D 场景与雨燕粒子形状
  components/    导航、页脚、全景图、磁吸按钮与产品示意画面
  sections/home/ 首页各屏：Hero、宣言、架构、产品、研发链路、演进路线、结尾 CTA
  pages/         首页、产品详情页、架构全景页、404
  styles/        设计 Token 与全局样式
scripts/
  postbuild.mjs  生成 sitemap.xml 与 404.html
public/          favicon、OG 图、robots.txt、.nojekyll
```

## 本地开发

需要 Node 22+ 与 pnpm 8。

```bash
pnpm install
pnpm dev          # 开发服务器
pnpm build        # 预渲染构建到 dist/
pnpm preview      # 本地预览构建产物
pnpm check        # lint + 类型检查 + 构建
```

## 动效三档

站点按设备能力自动分级，写在 `<html data-motion="...">` 上：

| 档位 | 触发条件 | 效果 |
| --- | --- | --- |
| `full` | 桌面、精确指针、支持 WebGL | 3D 雨燕、Lenis、固定滚动叙事、横向产品轨道 |
| `lite` | 移动端 / 触屏 / 低端设备 | 无 3D、无 Lenis，只保留轻量渐显 |
| `static` | `prefers-reduced-motion: reduce` | 无动画，内容直接可读 |

服务端渲染与首帧统一按 `static` 输出，挂载后再升级，保证无 JS 时内容完整。调试时可用 `?motion=full|lite|static` 强制档位。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会依次执行 lint、类型检查、构建，并把 `dist/` 部署到 GitHub Pages（Pages 来源设置为 GitHub Actions）。

## 内容约定

- 产品信息只改 `src/data/products.ts`，页面全部从这里取数。
- 只写可核实的事实，不编造数字；不写任何内网地址、内网仓库、VPN 网关或口令。
