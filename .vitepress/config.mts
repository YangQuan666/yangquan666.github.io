import {defineConfig} from 'vitepress'
import {tr} from "vuetify/locale";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "萨科的魔盒",
    description: "YangQuan的个人博客网站",
    lang: 'zh-CN',
    themeConfig: {
        logo: '/logo.svg',
        author: 'Yang Quan',
        signature: '一个爱折腾的程序员 )=￣ω￣=)',
        socialLinks: [
            {icon: 'mdi-twitter', link: 'https://discord.gg/J8BVvnsWeB'},
            {icon: 'mdi-github', link: 'https://github.com/YangQuan666'},
            {icon: 'mdi-email', link: 'quark.yeung@icloud.com'}
        ],
        nav: [
            {
                title: '游戏', icon: 'mdi-gamepad-circle-up', items: [
                    {title: 'Chrome Dinosaur', icon: 'mdi-google-downasaur', link: '/game/dinosaur/'},
                    {title: '2048', icon: 'mdi-numeric-2-box-multiple', link: '/game/2048/'}
                ]
            }, {
                title: '工具', icon: 'mdi-toolbox', items: [
                    {title: '历史上的今天', icon: 'mdi-calendar-today', link: '/tool/history/'},
                    {title: 'flag', icon: 'mdi-flag-checkered', link: '/tool/flag/'}
                ]
            }
        ],
        outline: 'deep',
        footer:  {
            message: 'Released under the GPL License.',
            copyright: 'Copyright © 2019-present Yang Quan',
            releaseNote: 'https://github.com/YangQuan666/yangquan666.github.io/blob/main/CHANGELOG.md'
        },
        search: {
            provider: 'local'
        }
    },
    lastUpdated: true,
    vite: {
        // ...
        ssr: {
            noExternal: ['vuetify']
        }
    },
    markdown: {
        headers: {level: [2, 3, 4, 5, 6]},
    },
    sitemap: {
        hostname: 'https://yangquan.netlify.app/'
    }
})
