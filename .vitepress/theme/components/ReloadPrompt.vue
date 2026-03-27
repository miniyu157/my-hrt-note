<script setup>
import { onMounted, ref } from 'vue'

const needRefresh = ref(false)

let updateServiceWorker

onMounted(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      needRefresh.value = true
    },
  })
})

const close = () => {
  needRefresh.value = false
}
</script>

<template>
  <Transition name="pwa-popup">
    <div v-if="needRefresh" class="pwa-toast" role="alert" aria-live="assertive">
      <div class="message">发现新版本，请刷新以查看最新内容。</div>
      <div class="buttons">
        <button class="button refresh" @click="updateServiceWorker()">重新加载</button>
        <button class="button close" @click="close">稍后</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 320px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.message {
  line-height: 1.5;
  font-weight: 500;
}

.buttons {
  display: flex;
  gap: 12px;
}

.button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.button:active {
  transform: scale(0.96);
}

.button.refresh {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-border);
}

@media (hover: hover) and (pointer: fine) {
  .button.refresh:hover {
    background-color: var(--vp-button-brand-hover-bg);
    border-color: var(--vp-button-brand-hover-border);
  }

  .button.close:hover {
    background-color: var(--vp-c-bg-mute);
  }
}

.pwa-popup-enter-active,
.pwa-popup-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.pwa-popup-enter-from,
.pwa-popup-leave-to {
  transform: translateY(24px) scale(0.96);
  opacity: 0;
}

@media (max-width: 640px) {
  .pwa-toast {
    right: 16px;
    left: 16px;
    width: auto;
    bottom: calc(16px + env(safe-area-inset-bottom));
    padding: 20px;
    text-align: center;
  }
  
  .message {
    font-size: 15px;
  }

  .button {
    min-height: 44px;
    padding: 12px 16px;
  }
}
</style>
