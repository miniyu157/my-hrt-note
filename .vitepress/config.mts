import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(
  defineConfig({
    lang: 'zh-Hans',
    cleanUrls: true,
    title: '梦花的 HRT 笔记',
    description: '个人 HRT 实践记录与指南',
    srcDir: 'docs',
    lastUpdated: true,
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'apple-touch-icon', href: '/pwa-192x192.png' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
    ],
    vite: {
      plugins: [
        GitChangelog({
          repoURL: () => 'https://github.com/miniyu157/my-hrt-note',
          mapAuthors: [
            {
              name: '梦花',
              username: 'miniyu157',
              mapByEmailAliases: [
                'miniyu157@163.com',
                '67086088+miniyu157@users.noreply.github.com',
              ],
              mapByNameAliases: ['padpro', 'ace3pro'],
            },
          ],
        }),
        GitChangelogMarkdownSection(),
      ],
    },

    pwa: {
      registerType: 'prompt',
      includeAssets: [
        'fonts/*.woff2',
        'favicon.ico',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],
      manifest: {
        name: '梦花的 HRT 笔记',
        short_name: 'HRT 笔记',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
      },
    },

    themeConfig: {
      darkModeSwitchLabel: '外观',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '目录',
      returnToTopLabel: '返回顶部',

      outline: {
        level: [2, 3],
        label: '本页目录',
      },

      search: {
        provider: 'local',
        options: {
          locales: {
            root: {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档',
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                  },
                },
              },
            },
          },
        },
      },

      editLink: {
        pattern:
          'https://github.com/miniyu157/my-hrt-note/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页面',
      },

      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium',
        },
      },

      footer: {
        message:
          '本站内容基于 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a> 许可协议发布。',
        copyright: '© 2026 Yumeka<miniyu157@163.com>',
      },

      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },

      nav: [{ text: '主页', link: '/' }],

      sidebar: generateSidebar({
        documentRootPath: '/docs',
        resolvePath: '/',
        useTitleFromFileHeading: true,
      }),

      socialLinks: [
        { icon: 'github', link: 'https://github.com/miniyu157/my-hrt-note' },
      ],
    },
  }),
)
