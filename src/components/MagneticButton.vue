<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ href: string; primary?: boolean; external?: boolean }>()

const el = ref<HTMLElement | null>(null)
const offset = ref({ x: 0, y: 0 })

function move(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !el.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = el.value.getBoundingClientRect()
  offset.value = {
    x: (e.clientX - rect.left - rect.width / 2) * 0.28,
    y: (e.clientY - rect.top - rect.height / 2) * 0.36,
  }
}

function leave() {
  offset.value = { x: 0, y: 0 }
}
</script>

<template>
  <a
    ref="el"
    :href="href"
    class="btn magnetic"
    :class="{ 'btn-primary': primary }"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    :style="{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }"
    @pointermove="move"
    @pointerleave="leave"
  >
    <slot />
  </a>
</template>

<style scoped>
.magnetic {
  height: 60px;
  padding: 0 32px;
  font-size: 17px;
  transition:
    transform 0.45s var(--ease),
    background 0.3s var(--ease),
    border-color 0.3s var(--ease);
}
</style>
