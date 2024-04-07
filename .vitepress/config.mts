import {defineConfig} from 'vitepress'
import {biAlipay, biDiscord, biGithub} from '@quasar/extras/bootstrap-icons'
import {version} from '../package.json'
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "萨科的魔术盒",
    description: "YangQuan的个人博客网站",
    lang: 'zh-CN',
    head: [
        ['meta', {name: 'viewport', content: 'user-scalable=0, initial-scale=1, maximum-scale=1, width=device-width'}],
        ['meta', {name: 'google-site-verification', content: 'RAVRlhHFJKHyrrg75VIxZPLEm6Vy7g846tY7WCmvQmA'}],
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
        ['link', {rel: 'me', href: 'https://mastodon.social/@Kourtsis'}]
    ],
    themeConfig: {
        author: 'Yang Quan',
        signature: '一个爱折腾的程序员 )=￣ω￣=)',
        outline: [2, 6],
        nav: [
            {
                text: '主页', icon: 'home', link: '/'
            },
            {
                text: '小游戏', icon: 'videogame_asset', items: [
                    {text: 'Chrome Dinosaur', link: '/game/dinosaur/', icon: 'smart_toy'},
                    {text: '2048', link: '/game/2048/', icon: 'casino'}
                ]
            },
            // {
            //     title: '小工具', icon: 'api', children: [
            //         {title: 'Json Formatter', link: '/tool/jsonFormatter', icon: 'hive'},
            //     ]
            // },
        ],
        socialLinks: [
            {icon: biGithub, link: 'https://github.com/YangQuan666'},
            {icon: biDiscord, link: 'https://discord.gg/J8BVvnsWeB'}
        ],
        sponsor: {
            icon: biAlipay,
            link: 'https://qr.alipay.com/fkx12630qiigpvf7yb0nd85'
        },
        comment: {
            icon: 'question_answer',
            link: 'https://github.com/YangQuan666/yangquan666.github.io/discussions'
        },
        footer: {
            message: 'Released under the GPL License.',
            releaseNote: 'https://github.com/YangQuan666/yangquan666.github.io/blob/main/CHANGELOG.md',
            version: version
        }
    },
    srcDir: "post",
    srcExclude: [],
    lastUpdated: true,
    appearance: true,
    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' }
    }
})
