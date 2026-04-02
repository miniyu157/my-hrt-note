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

watch(
  () => page.value.relativePath,
  (path) => {
    scale.value = 0
    if (path !== 'index.md') {
      requestAnimationFrame(update)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div v-show="page.relativePath !== 'index.md'" class="reading-progress-container">
    <div class="reading-progress-bar" :style="{ clipPath: `inset(0 ${100 - scale * 100}% 0 0)` }" />
    <div
      class="reading-progress-icon"
      :style="{
        left: `${scale * 100}%`,
        transform: `translate(-${scale * 100}%, -50%)`,
      }">
      🍥
    </div>
  </div>
</template>

<style scoped>
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 100;
  pointer-events: none;
}

.reading-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    #5bcefa 0,
    #5bcefa 12px,
    #f5a9b8 12px,
    #f5a9b8 24px,
    #ffffff 24px,
    #ffffff 36px
  );
  clip-path: inset(0 100% 0 0);
  will-change: clip-path;
  transition: clip-path 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.reading-progress-icon {
  position: absolute;
  top: 2px;
  font-size: 16px;
  line-height: 1;
  will-change: left, transform;
  transition:
    left 0.2s cubic-bezier(0, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}
</style>
