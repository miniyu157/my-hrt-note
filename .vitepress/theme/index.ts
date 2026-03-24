import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Disclaimer from './components/Disclaimer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Disclaimer', Disclaimer)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h('div', { class: 'custom-license' }, [
        h('p', null, [
          '本站内容基于 ',
          h('a', {
            href: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
            target: '_blank',
            rel: 'noreferrer'
          }, 'CC BY-NC-SA 4.0'),
          ' 许可协议发布。'
        ])
      ])
    })
  }
} satisfies Theme
