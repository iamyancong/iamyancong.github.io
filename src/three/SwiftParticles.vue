<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, MathUtils, Points, ShaderMaterial } from 'three'
import { onBeforeUnmount } from 'vue'
import { createSwiftBuffers, flapAt, RHYTHM } from './swiftShape'

const props = defineProps<{
  /** 0 = 成形悬停，1 = 完全飞离（随滚动） */
  scatter: number
  pointerX: number
  pointerY: number
  /** 可用竖向区域（占画布高度比例），据此自适应位置与大小 */
  frameTop: number
  frameBottom: number
  count?: number
}>()

/** 相机 z=7.2、fov=45 时，z=0 平面的可视高度 */
const VIEW_H = 2 * 7.2 * Math.tan((45 / 2) * (Math.PI / 180))
/** scale=1 时姿态下雨燕的大致竖向包围高度与中心偏移（实测） */
const BIRD_H = 3.9
const BIRD_CY = 0.1

/** 基础姿态：3/4 斜侧，向右上方飞行（弧度） */
const POSE = { pitch: 0.2, roll: 0.6, yaw: -0.45, x: 0.5, y: 1.38, scale: 0.56 }

const buffers = createSwiftBuffers(props.count ?? 16000)
const geometry = new BufferGeometry()
geometry.setAttribute('position', new BufferAttribute(buffers.start, 3))
geometry.setAttribute('aPlan', new BufferAttribute(buffers.plan, 3))
geometry.setAttribute('aMeta', new BufferAttribute(buffers.meta, 4))
geometry.setAttribute('aColor', new BufferAttribute(buffers.colors, 3))
geometry.setAttribute('aSize', new BufferAttribute(buffers.sizes, 1))

const material = new ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uScatter: { value: 0 },
    uTailSpread: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
  },
  vertexShader: /* glsl */ `
    attribute vec3 aPlan;
    attribute vec4 aMeta;
    attribute vec3 aColor;
    attribute float aSize;
    uniform float uTime;
    uniform float uAssemble;
    uniform float uScatter;
    uniform float uTailSpread;
    uniform float uPixelRatio;
    varying vec3 vColor;
    varying float vAlpha;

    const float PERIOD = ${RHYTHM.period.toFixed(2)};
    const float WINDOW = ${RHYTHM.flapWindow.toFixed(2)};
    const float BEATS = ${RHYTHM.beats.toFixed(1)};

    // 与 swiftShape.ts 的 flapAt 保持一致：三次振翅 + 滑翔
    float flapAt(float t) {
      float c = mod(t, PERIOD);
      float env = smoothstep(0.0, 0.18, c) * (1.0 - smoothstep(WINDOW - 0.2, WINDOW, c));
      float beat = sin(c / WINDOW * BEATS * 6.2831853);
      float glide = 0.16 + 0.05 * sin(t * 1.3);
      return beat * env * 0.95 + glide * (1.0 - env);
    }

    // 翅膀姿态：肩部与腕部两级弯折，翼尖幅度最大；下拍时手翼略向后收
    vec3 poseWing(vec3 p, float t) {
      float ax = abs(p.x);
      float side = sign(p.x);
      float span = clamp((ax - 0.1) / 3.0, 0.0, 1.0);
      float f = flapAt(t);
      float lift = f * (0.45 * span + 0.7 * span * span) * 0.95;
      p.z += lift;
      p.x -= side * 0.16 * abs(lift) * span;
      p.y -= (max(0.0, -f) * 0.22 + 0.05) * span * span;
      return p;
    }

    vec3 poseTail(vec3 p, float along, float t) {
      p.x *= 1.0 + uTailSpread * along * 0.8;
      p.z += sin(t * 2.1 + along * 3.0) * 0.05 * along + along * along * 0.12;
      return p;
    }

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      float part = aMeta.x;
      float edge = aMeta.y;
      float along = aMeta.z;
      float seed = aMeta.w;
      float f = flapAt(uTime);

      vec3 shaped;
      float alpha = 1.0;
      float size = aSize;

      if (part > 2.5) {
        // 尾迹：回溯锚点过去的位置，形成随振翅起伏的流光
        float life = fract(along + uTime * 0.55);
        float past = uTime - life * 0.9;
        vec3 anchor = vec3(aPlan.xy, 0.0);
        vec3 p = aPlan.z < 1.5 ? poseWing(anchor, past) : poseTail(anchor, 1.0, past);
        p.y -= life * 2.8;
        p += (vec3(hash(seed * 91.0), hash(seed * 37.0), hash(seed * 13.0)) - 0.5) * life * 0.35;
        shaped = p;
        alpha = pow(1.0 - life, 1.8) * 0.95 * smoothstep(0.6, 1.0, uAssemble);
        size *= 1.25 - life * 0.75;
      } else if (part > 1.5) {
        shaped = poseTail(aPlan, along, uTime);
        alpha = 1.0 - along * 0.45;
      } else if (part > 0.5) {
        shaped = poseWing(aPlan, uTime);
      } else {
        shaped = aPlan;
      }

      // 身体随振翅轻微反向起伏
      shaped.z -= f * 0.05;
      // 细微呼吸噪声
      shaped += 0.012 * vec3(sin(uTime * 2.3 + seed * 40.0), cos(uTime * 1.9 + seed * 30.0), 0.0);

      // 入场：先身体、后翼尖，沿弧线旋入
      float delay = part < 0.5 ? seed * 0.2 : 0.15 + along * 0.35 + seed * 0.15;
      float e = clamp((uAssemble - delay) / 0.5, 0.0, 1.0);
      e = 1.0 - pow(1.0 - e, 3.0);
      vec3 swirl = vec3(-position.y, position.x, 0.0) * 0.35 * sin(e * 3.14159);
      vec3 pos = mix(position, shaped, e) + swirl;

      // 滚动飞离：粒子沿外侧散开
      vec3 dir = normalize(shaped + vec3(hash(seed) - 0.5, hash(seed + 1.0) - 0.5, 0.6));
      pos += dir * uScatter * (0.6 + seed * 3.5);

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = size * uPixelRatio * (30.0 / -mv.z);

      // 轮廓流光：沿翼展流动的高光
      float shimmer = edge * (0.45 + 0.55 * sin(uTime * 2.6 - along * 8.0 + seed));
      vColor = mix(aColor, vec3(1.0), clamp(shimmer * 0.5, 0.0, 0.6)) * (0.78 + shimmer * 0.4);
      vAlpha = alpha * (0.25 + 0.75 * e) * (1.0 - uScatter * 0.9);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vColor, a * a * vAlpha);
    }
  `,
})

const points = new Points(geometry, material)
points.frustumCulled = false
// 外层：位置漂移、跟随指针、滚动飞离；内层：3/4 基础姿态
const rig = new Group()
const body = new Group()
body.rotation.order = 'ZYX'
body.add(points)
rig.add(body)

const follow = { x: 0, y: 0 }
let scatterEased = 0
let born = -1

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta, elapsed }) => {
  const u = material.uniforms
  const dt = Math.min(delta, 0.05)
  u.uTime.value = elapsed
  // 入场按真实时间推进，低帧率时也在约 1.8 秒内成形
  if (born < 0) born = elapsed
  u.uAssemble.value = Math.min(1.2, (elapsed - born) / 1.8)
  scatterEased += (props.scatter - scatterEased) * Math.min(1, dt * 5)
  u.uScatter.value = scatterEased

  const f = flapAt(elapsed)
  // 指针跟随：低增益、慢阻尼，只轻微转头与平移
  follow.x += (props.pointerX - follow.x) * Math.min(1, dt * 1.2)
  follow.y += (props.pointerY - follow.y) * Math.min(1, dt * 1.2)

  // 侧倾随转向变化，尾羽在转向时张开
  const turn = Math.sin(elapsed * 0.37) * 0.6 + follow.x * 0.5
  u.uTailSpread.value = Math.abs(turn) * 0.6

  body.rotation.x = POSE.pitch + Math.sin(elapsed * 0.6) * 0.06 + f * 0.035 - follow.y * 0.1
  body.rotation.y = POSE.roll + turn * 0.12
  body.rotation.z = POSE.yaw - turn * 0.08 - follow.x * 0.1

  // 轨迹漂移 + 振翅时的上下起伏
  const fly = MathUtils.smootherstep(scatterEased, 0, 1)
  // 按可用区域自适应：区域中心对应的世界坐标 y，以及能放下的最大缩放
  const top = VIEW_H / 2 - props.frameTop * VIEW_H
  const bottom = VIEW_H / 2 - props.frameBottom * VIEW_H
  const fit = Math.min(POSE.scale, ((top - bottom) * 0.86) / BIRD_H)
  const baseY = (top + bottom) / 2 - BIRD_CY * fit
  rig.position.set(
    POSE.x + Math.sin(elapsed * 0.23) * 0.32 + follow.x * 0.25 + fly * 4.2,
    baseY + Math.sin(elapsed * 0.31 + 1.2) * 0.1 - f * 0.03 - follow.y * 0.08 + fly * 2.6,
    fly * 1.6,
  )
  rig.scale.setScalar(fit * (1 + fly * 0.25))
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>

<template>
  <primitive :object="rig" />
</template>
