<template>
  <ClientOnly>
    <Waline
      :key="path"
      :serverURL="serverURL"
      :path="path"
      :meta="['nick', 'mail']"
      :search="false"
      :emoji="[]"
      dark="html.dark"
    />
  </ClientOnly>
</template>

<script setup>
import { Waline } from '@waline/client/component';
import { computed } from 'vue';
import { useRoute } from 'vitepress';

import '@waline/client/style';
import '../waline-theme.css';

const serverURL = 'https://my-hrt-note-server.vercel.app';
const route = useRoute();
const path = computed(() => route.path.replace(/(index)?\.html$/, ''));
</script>
