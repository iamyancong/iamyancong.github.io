<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three'
import { onBeforeUnmount } from 'vue'
import { createSwiftBuffers } from './swiftShape'

const props = defineProps<{
  /** 0 = 聚合成形，1 = 完全散开（随滚动） */
  scatter: number
  pointerX: number
  pointerY: number
  count?: number
}>()

const buffers = createSwiftBuffers(props.count ?? 14000)
const geometry = new BufferGeometry()
geometry.setAttribute('position', new BufferAttribute(buffers.start, 3))
geometry.setAttribute('aTarget', new BufferAttribute(buffers.target, 3))
geometry.setAttribute('aColor', new BufferAttribute(buffers.colors, 3))
geometry.setAttribute('aSize', new BufferAttribute(buffers.sizes, 1))
geometry.setAttribute('aDelay', new BufferAttribute(buffers.delays, 1))

const material = new ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uScatter: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
  },
  vertexShader: /* glsl */ `
    attribute vec3 aTarget;
    attribute vec3 aColor;
    attribute float aSize;
    attribute float aDelay;
    uniform float uTime;
    uniform float uAssemble;
    uniform float uScatter;
    uniform float uPixelRatio;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      float t = clamp((uAssemble - aDelay) / (1.0 - 0.35), 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);
      vec3 shaped = aTarget;
      // 翅膀缓慢扇动：离身体越远，起伏越大
      float wing = smoothstep(0.3, 3.4, abs(aTarget.x));
      shaped.y += sin(uTime * 1.4 - abs(aTarget.x) * 0.9) * 0.1 * wing;
      shaped.z += cos(uTime * 1.4 - abs(aTarget.x) * 0.9) * 0.18 * wing;
      // 呼吸感微扰
      shaped += 0.018 * vec3(sin(uTime * 2.1 + aTarget.y * 9.0), cos(uTime * 1.7 + aTarget.x * 7.0), 0.0);
      vec3 pos = mix(position, shaped, t);
      // 滚动散开：沿径向推出并向镜头飞来
      vec3 dir = normalize(aTarget + vec3(0.0001, 0.0001, 1.2));
      pos += dir * uScatter * (2.5 + aDelay * 9.0);
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPixelRatio * (30.0 / -mv.z);
      vColor = aColor;
      vAlpha = (0.35 + 0.65 * t) * (1.0 - uScatter * 0.85);
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
let rotY = 0
let rotX = 0

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta, elapsed }) => {
  const u = material.uniforms
  u.uTime.value = elapsed
  // 入场聚合约 2.4 秒
  u.uAssemble.value = Math.min(1, u.uAssemble.value + delta / 2.4)
  u.uScatter.value += (props.scatter - u.uScatter.value) * Math.min(1, delta * 6)
  // 鼠标视差：平滑跟随
  rotY += (props.pointerX * 0.35 - rotY) * Math.min(1, delta * 3)
  rotX += (-props.pointerY * 0.22 - rotX) * Math.min(1, delta * 3)
  points.rotation.y = rotY + Math.sin(elapsed * 0.25) * 0.06
  points.rotation.x = rotX + 0.08
})


onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>

<template>
  <primitive :object="points" />
</template>
