/**
 * 生成「雨燕」抽象剪影的粒子目标点：身体 + 两翼（新月形）+ 剪刀尾。
 * 纯数学采样，不依赖外部模型文件。
 */
function rand(seed: { v: number }) {
  // 可复现的伪随机，保证每次构建造型一致
  seed.v = (seed.v * 16807) % 2147483647
  return (seed.v - 1) / 2147483646
}

export interface SwiftBuffers {
  start: Float32Array
  target: Float32Array
  colors: Float32Array
  sizes: Float32Array
  delays: Float32Array
}

const PALETTE: [number, number, number][] = [
  [0.56, 0.7, 1.0],
  [0.31, 0.49, 1.0],
  [0.55, 0.36, 0.96],
  [0.13, 0.83, 0.93],
  [0.95, 0.96, 1.0],
]

export function createSwiftBuffers(count: number): SwiftBuffers {
  const seed = { v: 20261118 }
  const r = () => rand(seed)
  const start = new Float32Array(count * 3)
  const target = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const delays = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    let x = 0
    let y = 0
    let z = 0
    const pick = r()

    if (pick < 0.7) {
      // 翅膀：新月形后掠翼。u 沿展向（0 根部 → 1 翼尖），s 沿弦向
      const side = r() < 0.5 ? -1 : 1
      const u = Math.pow(r(), 0.8)
      const s = r()
      const span = 0.18 + u * 3.0
      const lead = 0.38 + 0.28 * Math.sin(Math.PI * u) - 1.25 * Math.pow(u, 1.7)
      const chord = 0.82 * Math.pow(1 - u, 0.75) + 0.035
      x = side * (span + s * chord * 0.35 * u)
      y = lead - s * chord
      z = (r() - 0.5) * 0.16 * (1 - u)
    } else if (pick < 0.86) {
      // 身体：流线型，头部略圆
      const a = r() * Math.PI * 2
      const rr = Math.sqrt(r())
      const by = Math.sin(a) * rr * 0.72
      const width = 0.26 * (1 - Math.max(0, -by) * 0.55)
      x = Math.cos(a) * rr * width
      y = by + 0.12
      z = (r() - 0.5) * 0.26
    } else {
      // 剪刀尾：两根逐渐变细并外张的尾羽
      const side = r() < 0.5 ? -1 : 1
      const t = r()
      const w = 0.16 * (1 - t) + 0.012
      x = side * (0.05 + t * t * 0.62) + (r() - 0.5) * w
      y = -0.5 - t * 1.25
      z = (r() - 0.5) * 0.08
    }

    // 轻微抖动，让轮廓更有颗粒感
    x += (r() - 0.5) * 0.035
    y += (r() - 0.5) * 0.035

    // 整体缩放并上移，让剪影位于首屏上半部、标题之上
    target[i * 3] = x * 0.86
    target[i * 3 + 1] = y * 0.72 + 1.84
    target[i * 3 + 2] = z

    // 起点：散布在大球壳上
    const th = r() * Math.PI * 2
    const ph = Math.acos(2 * r() - 1)
    const rad = 5 + r() * 6
    start[i * 3] = Math.sin(ph) * Math.cos(th) * rad
    start[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * rad * 0.6
    start[i * 3 + 2] = Math.cos(ph) * rad - 2

    const c = PALETTE[Math.floor(r() * PALETTE.length)]
    const k = 0.75 + r() * 0.25
    colors[i * 3] = c[0] * k
    colors[i * 3 + 1] = c[1] * k
    colors[i * 3 + 2] = c[2] * k

    sizes[i] = 0.6 + Math.pow(r(), 3) * 2.4
    delays[i] = r() * 0.35
  }

  return { start, target, colors, sizes, delays }
}
