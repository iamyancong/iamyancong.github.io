/**
 * 雨燕粒子造型：在「俯视平面图」(planform) 上用贝塞尔曲线描出
 * 新月形后掠翼、流线身体与细长分叉燕尾，再按面积与轮廓采样成粒子目标点。
 *
 * 坐标约定（局部空间，单位≈世界单位）：
 *   +y 指向头部，x 为翼展方向（右翼为 +x），z 为厚度方向。
 * 姿态（3/4 斜侧、俯仰、侧倾）与振翅在着色器和 SwiftParticles.vue 里完成，
 * 这里只负责静态造型，保证纯函数、可复现、可在 Node 中单独绘图调试。
 */

export const PART = { body: 0, wing: 1, tail: 2, trail: 3 } as const

export interface SwiftBuffers {
  count: number
  /** 入场起点（局部空间） */
  start: Float32Array
  /** 平面图目标点 */
  plan: Float32Array
  /** x: 部位 PART，y: 轮廓权重 0..1，z: 沿翼展/尾羽的归一化位置 0..1，w: 随机种子 */
  meta: Float32Array
  colors: Float32Array
  sizes: Float32Array
}

type Vec2 = [number, number]

function rng(seed: number) {
  let v = seed
  return () => {
    v = (v * 16807) % 2147483647
    return (v - 1) / 2147483646
  }
}

function bezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const m = 1 - t
  const a = m * m * m
  const b = 3 * m * m * t
  const c = 3 * m * t * t
  const d = t * t * t
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]
}

// 右翼：前缘外凸、后缘内凹，两条曲线在翼尖汇合，形成弯月形后掠翼
const WING_TIP: Vec2 = [3.1, -1.12]
const LEAD: [Vec2, Vec2, Vec2, Vec2] = [[0.1, 0.3], [1.1, 0.86], [1.3, 0.8], WING_TIP]
const TRAIL: [Vec2, Vec2, Vec2, Vec2] = [[0.1, -0.22], [1.05, 0.08], [2.25, 0.02], WING_TIP]

// 右侧尾羽：自尾基向后、外张并逐渐变细
const TAIL_TIP: Vec2 = [0.66, -1.5]
const TAIL: [Vec2, Vec2, Vec2, Vec2] = [[0.07, -0.48], [0.18, -0.86], [0.34, -1.22], TAIL_TIP]

/** 翼尖 / 尾尖锚点，供尾迹粒子使用：0 左翼尖 1 右翼尖 2 左尾尖 3 右尾尖 */
export const ANCHORS: Vec2[] = [
  [-WING_TIP[0], WING_TIP[1]],
  [WING_TIP[0], WING_TIP[1]],
  [-TAIL_TIP[0], TAIL_TIP[1]],
  [TAIL_TIP[0], TAIL_TIP[1]],
]

function wingPoint(u: number, s: number): Vec2 {
  const l = bezier(...LEAD, u)
  const t = bezier(...TRAIL, u)
  return [l[0] + (t[0] - l[0]) * s, l[1] + (t[1] - l[1]) * s]
}

function wingChord(u: number) {
  const l = bezier(...LEAD, u)
  const t = bezier(...TRAIL, u)
  return Math.hypot(l[0] - t[0], l[1] - t[1])
}

/** 身体半径剖面：头部圆润，向尾基收细 */
function bodyRadius(y: number) {
  const k = (y - 0.06) / 0.6
  if (Math.abs(k) >= 1) return 0
  const base = 0.2 * Math.sqrt(1 - k * k)
  const taper = 0.5 + 0.5 * Math.min(1, Math.max(0, (y + 0.55) / 0.75))
  return base * taper
}

const PALETTE: [number, number, number][] = [
  [0.56, 0.7, 1.0],
  [0.36, 0.52, 1.0],
  [0.6, 0.42, 0.98],
  [0.2, 0.84, 0.95],
  [0.92, 0.95, 1.0],
]

export const TRAIL_SHARE = 0.16

export function createSwiftBuffers(count: number): SwiftBuffers {
  const r = rng(20261118)
  const start = new Float32Array(count * 3)
  const plan = new Float32Array(count * 3)
  const meta = new Float32Array(count * 4)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  const maxChord = wingChord(0.12) * 1.05

  for (let i = 0; i < count; i++) {
    let x = 0
    let y = 0
    let z = 0
    let part: number = PART.wing
    let edge = 0
    let along = 0
    const pick = r()

    if (pick < TRAIL_SHARE) {
      // 尾迹：锚在翼尖/尾尖上，具体轨迹在着色器里按时间回溯
      part = PART.trail
      const a = Math.floor(r() * 4)
      const anchor = ANCHORS[a]
      x = anchor[0]
      y = anchor[1]
      z = a
      along = r()
    } else if (pick < TRAIL_SHARE + 0.55) {
      part = PART.wing
      const side = r() < 0.5 ? -1 : 1
      // 按弦长做拒绝采样，让翼面密度均匀
      let u = 0
      for (let k = 0; k < 12; k++) {
        u = r()
        if (r() < wingChord(u) / maxChord + 0.04) break
      }
      let s: number
      const e = r()
      if (e < 0.16) {
        s = Math.pow(r(), 3) * 0.06 // 前缘：亮而密
        edge = 1
      } else if (e < 0.24) {
        s = 1 - Math.pow(r(), 3) * 0.05 // 后缘
        edge = 0.6
      } else {
        s = r()
      }
      const p = wingPoint(u, s)
      // 后缘靠近翼尖处做出初级飞羽的细小锯齿
      const feather = s > 0.8 ? Math.sin(u * 46) * 0.025 * u : 0
      x = side * p[0]
      y = p[1] - feather
      z = (r() - 0.5) * 0.05 * (1 - u)
      along = u
    } else if (pick < TRAIL_SHARE + 0.55 + 0.15) {
      part = PART.body
      let yy = 0
      let rad = 0
      for (let k = 0; k < 12; k++) {
        yy = -0.55 + r() * 1.21
        rad = bodyRadius(yy)
        if (r() < rad / 0.2) break
      }
      const a = r() * Math.PI * 2
      const shell = r() < 0.55
      const rr = rad * (shell ? 0.92 + r() * 0.08 : Math.sqrt(r()))
      x = Math.cos(a) * rr
      z = Math.sin(a) * rr * 0.85
      y = yy
      edge = shell ? 0.5 : 0
      along = (yy + 0.55) / 1.21
    } else {
      part = PART.tail
      const side = r() < 0.5 ? -1 : 1
      const t = Math.pow(r(), 1.1)
      if (r() < 0.32) {
        // 尾基之间的扇形尾羽：分叉从一整片尾羽里长出来，而不是两根棍
        const tt = Math.pow(r(), 0.7) * 0.5
        const c = bezier(...TAIL, tt)
        const k = r() * 2 - 1
        x = k * c[0]
        // 内缘呈 V 形缺口：越靠中线越短
        const notch = (tt / 0.5) * (1 - Math.abs(k)) * 0.42
        y = c[1] + notch
        edge = 0.2
        along = tt
      } else {
        const c = bezier(...TAIL, t)
        const w = 0.11 * Math.pow(1 - t, 1.6) + 0.006
        const off = (r() - 0.5) * w
        x = side * (c[0] + off)
        y = c[1] + off * 0.3
        edge = t > 0.6 ? 0.8 : 0.3
        along = t
      }
      z = (r() - 0.5) * 0.03
    }

    // 微小抖动，避免机械感
    x += (r() - 0.5) * 0.018
    y += (r() - 0.5) * 0.018

    plan[i * 3] = x
    plan[i * 3 + 1] = y
    plan[i * 3 + 2] = z
    meta[i * 4] = part
    meta[i * 4 + 1] = edge
    meta[i * 4 + 2] = along
    meta[i * 4 + 3] = r()

    // 入场起点：一团围绕身体的旋涡，粒子从中聚拢成形
    const th = r() * Math.PI * 2
    const rad = 2.2 + r() * 3.6
    start[i * 3] = Math.cos(th) * rad
    start[i * 3 + 1] = Math.sin(th) * rad * 0.55 - 0.3
    start[i * 3 + 2] = (r() - 0.5) * 4

    const c = edge > 0.7 ? PALETTE[4] : PALETTE[Math.floor(r() * 4)]
    const k = 0.72 + r() * 0.28
    colors[i * 3] = c[0] * k
    colors[i * 3 + 1] = c[1] * k
    colors[i * 3 + 2] = c[2] * k

    sizes[i] = part === PART.trail ? 0.5 + r() * 0.9 : 0.55 + Math.pow(r(), 3) * 2.0 + edge * 0.2
  }

  return { count, start, plan, meta, colors, sizes }
}

/**
 * 振翅节律（秒 → 振幅），着色器里有一份同样的 GLSL 实现。
 * 一个周期 2.8s：约 0.95s 连续三次快速振翅，其余时间展翼滑翔并带微小起伏。
 */
export const RHYTHM = { period: 2.8, flapWindow: 0.95, beats: 3 } as const

export function flapAt(time: number): number {
  const c = ((time % RHYTHM.period) + RHYTHM.period) % RHYTHM.period
  const w = RHYTHM.flapWindow
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  const env = smooth(0, 0.18, c) * (1 - smooth(w - 0.2, w, c))
  const beat = Math.sin((c / w) * RHYTHM.beats * Math.PI * 2)
  const glide = 0.16 + 0.05 * Math.sin(time * 1.3)
  return beat * env * 0.95 + glide * (1 - env)
}
