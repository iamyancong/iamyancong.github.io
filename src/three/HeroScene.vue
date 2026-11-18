<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import SwiftParticles from './SwiftParticles.vue'

defineProps<{ scatter: number; pointerX: number; pointerY: number }>()
</script>

<template>
  <TresCanvas :alpha="true" :clear-alpha="0" :antialias="false" :dpr="[1, 2]" power-preference="high-performance">
    <TresPerspectiveCamera :position="[0, 0, 7.2]" :fov="45" :look-at="[0, 0, 0]" />
    <SwiftParticles :scatter="scatter" :pointer-x="pointerX" :pointer-y="pointerY" />
  </TresCanvas>
</template>
