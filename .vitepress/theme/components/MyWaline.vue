<template>
  <div ref="walineContainer">
    <ClientOnly>
      <Waline
        :key="path"
        :serverURL="serverURL"
        :path="path"
        :search="false"
        :emoji="[]"
        :noCopyright="false"
        :noRss="true"
        dark="html.dark" />
    </ClientOnly>
  </div>
</template>

<script setup>
import { Waline } from '@waline/client/component'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

import '@waline/client/style'
import '../waline-theme.css'

const serverURL = 'https://my-hrt-note-server.vercel.app'
const route = useRoute()
const path = computed(() => route.path.replace(/(index)?\.html$/, ''))

const walineContainer = ref(null)
let observer = null

onMounted(() => {
  observer = new MutationObserver(() => {
    const loginInfo = document.querySelector('.wl-login-info')
    const editor = document.getElementById('wl-edit')
    if (editor) {
      if (!loginInfo) {
        editor.placeholder = '无需登录即可讨论...\n也可以点击这里后在右下角进行登录。'
      } else {
        editor.placeholder = '说说你的看法！'
      }
    }
  })

  if (walineContainer.value) {
    observer.observe(walineContainer.value, {
      childList: true,
      subtree: true,
    })
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
