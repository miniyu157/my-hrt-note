import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

import { 
  GitChangelog, 
  GitChangelogMarkdownSection 
} from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig({
  lang: 'zh-Hans',
  cleanUrls: true,
  title: "梦花的 HRT 笔记",
  description: "个人 HRT 实践记录与指南",
  srcDir: 'docs',
  lastUpdated: true,

  vite: {
    plugins: [
      GitChangelog({
        repoURL: () => 'https://github.com/miniyu157/my-hrt-note',
      }),
      GitChangelogMarkdownSection(),
    ],
  },

  themeConfig: {
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/miniyu157/my-hrt-note/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    footer: {
      message: '本站内容基于 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a> 许可协议发布。',
      copyright: '© 2026 Yumeka<miniyu157@163.com>'
    },
    
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    nav: [
      { text: '主页', link: '/' }
    ],

    sidebar: generateSidebar({
      documentRootPath: '/docs',
      resolvePath: '/',
      useTitleFromFileHeading: true,
      useExtension: false,
      excludeFiles: [],
    }),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/miniyu157/my-hrt-note' }
    ]
  }
})
