import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Disclaimer from './components/Disclaimer.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'
import './custom.css'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Disclaimer', Disclaimer)
    app.use(NolebaseGitChangelogPlugin, {
      locales: {
        'zh-Hans': {
          changelog: {
            title: '修订记录',
            noData: '暂无修订记录',
          },
          contributors: {
            title: '编写',
          },
        },
      },
    })
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'layout-bottom': () => h(ReloadPrompt),
      'doc-footer-before': () =>
        h('div', { class: 'custom-license' }, [
          h('p', null, [
            '本站内容基于 ',
            h(
              'a',
              {
                href: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
                target: '_blank',
                rel: 'noreferrer',
              },
              'CC BY-NC-SA 4.0',
            ),
            ' 许可协议发布。',
          ]),
        ]),
    })
  },
} satisfies Theme
