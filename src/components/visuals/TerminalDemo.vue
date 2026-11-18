<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ command: string; lines?: string[] }>(), { lines: () => [] })
const typed = ref(props.command)
const shown = ref(props.lines.length)
let timer: number | undefined
let observer: IntersectionObserver | undefined

function play() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  typed.value = ''
  shown.value = 0
  let i = 0
  window.clearInterval(timer)
  timer = window.setInterval(() => {
    i++
    typed.value = props.command.slice(0, i)
    if (i >= props.command.length) {
      window.clearInterval(timer)
      let j = 0
      timer = window.setInterval(() => {
        j++
        shown.value = j
        if (j >= props.lines.length) window.clearInterval(timer)
      }, 380)
    }
  }, 55)
}

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        play()
        observer?.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  if (el.value) observer.observe(el.value)
})
onBeforeUnmount(() => {
  window.clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <div ref="el" class="term">
    <div class="term-bar"><i /><i /><i /></div>
    <pre class="term-body"><span class="prompt">$</span> {{ typed }}<span class="caret" />
<template v-for="(line, i) in lines" :key="line"><span v-if="i < shown" class="out">{{ line }}
</span></template></pre>
  </div>
</template>

<style scoped>
.term {
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  background: rgba(6, 8, 14, 0.9);
  overflow: hidden;
  font-family: var(--mono);
}

.term-bar {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
}

.term-bar i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.term-body {
  margin: 0;
  padding: 14px 16px 16px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 140px;
}

.prompt {
  color: var(--cyan);
}

.out {
  color: var(--text-2);
}

.caret {
  display: inline-block;
  width: 7px;
  height: 15px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--cyan);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
