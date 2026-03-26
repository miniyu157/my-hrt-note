<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const scale = ref(0)
let ticking = false

const update = () => {
  if (page.value.relativePath === 'index.md') return

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  const h = scrollHeight - clientHeight
  scale.value = h > 0 ? scrollTop / h : 0
  ticking = false
}

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(update)
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

watch(() => page.value.relativePath, (path) => {
  scale.value = 0
  if (path !== 'index.md') {
    requestAnimationFrame(update)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div 
    v-show="page.relativePath !== 'index.md'"
    class="reading-progress-bar" 
    :style="{ transform: `scaleX(${scale})` }" 
  />
</template>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--vp-c-brand-1);
  transform-origin: 0 50%;
  z-index: 100;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
