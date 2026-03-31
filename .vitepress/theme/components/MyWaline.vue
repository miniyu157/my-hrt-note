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
import mediumZoom from 'medium-zoom'

import '@waline/client/style'
import '../waline-theme.css'

const serverURL = 'https://my-hrt-note-server.vercel.app'
const route = useRoute()
const path = computed(() => route.path.replace(/(index)?\.html$/, ''))

const walineContainer = ref(null)
let observer = null
let zoom = null

onMounted(() => {
  let isProcessing = false

  zoom = mediumZoom({
    background: 'var(--vp-c-bg)',
    margin: 24,
  })

  observer = new MutationObserver(() => {
    if (isProcessing) return
    isProcessing = true

    const loginInfo = document.querySelector('.wl-login-info')
    const editor = document.getElementById('wl-edit')
    if (editor) {
      if (!loginInfo) {
        editor.placeholder = '无需登录即可讨论...\n也可以点击这里后在右下角进行登录。'
      } else {
        editor.placeholder = '说说你的看法！'
      }
    }

    const contents = document.querySelectorAll('.wl-content:not([data-processed])')
    contents.forEach((content) => {
      content.setAttribute('data-processed', 'true')
      const paragraphs = content.querySelectorAll('p')

      paragraphs.forEach((p) => {
        let group = []
        let dump = []
        const childNodes = Array.from(p.childNodes)

        const buildGallery = (anchor) => {
          if (group.length > 0) {
            const wrapper = document.createElement('div')
            wrapper.className = `wl-gallery wl-gallery-${group.length}`
            p.insertBefore(wrapper, anchor)
            group.forEach((img) => wrapper.appendChild(img))
            dump.forEach((n) => n.remove())

            zoom.attach(group)

            group = []
            dump = []
          }
        }

        for (const node of childNodes) {
          if (node.nodeName === 'IMG') {
            group.push(node)
          } else if (node.nodeName === 'BR' && group.length > 0) {
            dump.push(node)
          } else if (node.nodeType === 3 && !node.textContent.trim() && group.length > 0) {
            dump.push(node)
          } else {
            buildGallery(node)
          }
        }
        buildGallery(null)
      })
    })

    isProcessing = false
  })

  if (walineContainer.value) {
    observer.observe(walineContainer.value, {
      childList: true,
      subtree: true,
    })
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (zoom) zoom.detach()
})
</script>
