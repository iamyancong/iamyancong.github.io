# AGENTS.md

给在本仓库工作的 Coding Agent 的约定。

## 项目

王彦聪前端研发体系官网，部署在 <https://iamyancong.github.io/>（GitHub Pages 用户站，`base` 为 `/`）。

技术栈：Vue 3 + TypeScript + Vite + vite-ssg；GSAP（ScrollTrigger、SplitText）+ Lenis；TresJS + three.js；Vue Flow。包管理器 pnpm 8，Node 22+。

## 目录

- `src/data/`：唯一事实来源。产品、关系、链路、路线图都在 `products.ts`，站点信息与外链在 `site.ts`。
- `src/motion/`：动效分级（`tier.ts`）、GSAP 注册（`gsap.ts`）、Lenis（`smoothScroll.ts`）、`useTierAnimation`。
- `src/three/`：首屏 3D，必须保持懒加载，只在 `full` 档挂载。
- `src/sections/home/`、`src/pages/`、`src/components/`：页面与组件。
- `scripts/postbuild.mjs`：生成 sitemap 与 404.html。

## 必须遵守

1. **内容只来自 `src/data/`**，不要在组件里硬编码产品事实。
2. **不编造数字**：版本号、数量等只写能在仓库或 npm 上核实的值；拿不准就不写。
3. **不写内部信息**：内网 IP、内网 GitLab 地址、VPN 网关、账号口令一律不进仓库。
4. **三档动效**：新动画通过 `useTierAnimation(root, (level, el) => ...)` 注册，`static` 档不执行；`lite` 档不得引入 3D 或 Lenis。SSR 与首帧按 `static` 渲染，内容在无 JS 时必须完整可见。
5. **SSR 安全**：访问 `window`、`document`、WebGL 的代码只能放在 `onMounted` 或客户端动态 import 中。
6. **GSAP 与 Vue 不要抢写同一个 transform**：被 Vue 绑定了 `style.transform` 的元素（如磁吸按钮），动画打在外层容器上。
7. Vue scoped 样式里不要写 `:global(html...) .x` 这类组合选择器（会被编译成只作用于 `html`），需要按 `data-motion` 切换样式时用 `[data-motion='full'] .x` 或独立的非 scoped 块并限定在组件根类下。

## 命令

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build
pnpm check   # 提交前必须通过：lint + type-check + build
```

## 提交与分支

- 改动走功能分支并开 PR，不直接推 `main`，不 force push。
- 提交前跑 `pnpm check`，涉及视觉的改动请在桌面（1440 宽）和移动端（390 宽）各自确认一遍，控制台无报错。
