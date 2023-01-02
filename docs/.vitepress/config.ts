import {buildSummary} from './theme/composables/metadata'
import {biDiscord, biGithub, biMastodon} from '@quasar/extras/bootstrap-icons'
import {version} from '../../package.json'

buildSummary()

export default {
    title: '萨科的魔术盒',
    description: 'YangQuan666的个人博客网站',
    lang: 'zh-CN',
    head: [
        ['meta', {name: 'viewport', content: 'user-scalable=no, initial-scale=1, width=device-width'}],
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
        ['link', {rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'}],
        ['link', {rel: 'me', href: 'https://mastodon.social/@Kourtsis'}]
    ],
    themeConfig: {
        author: 'YangQuan',
        signature: '一个爱折腾的程序员=￣ω￣=) ',
        outline: 'deep',
        nav: [
            {
                title: '主页', icon: 'home', link: '/'
            },
            {
                title: '小游戏', icon: 'smart_toy', children: [
                    {title: 'Chrome Dinosaur', link: '/game/dinosaur', icon: 'casino'},
                    {title: 'Flappy Bird', link: '/game/flappyBird', icon: 'casino'},
                    {title: '2048', link: '/game/2048', icon: 'casino'},
                ]
            },
            {
                title: '小工具', icon: 'api', children: [
                    {title: 'Json Formatter', link: '/tool/jsonFormatter', icon: 'hive'},
                ]
            },
        ],
        socialLinks: [
            {icon: biMastodon, link: 'https://mastodon.social/@Kourtsis'},
            {icon: biGithub, link: 'https://github.com/YangQuan666'},
            {icon: biDiscord, link: 'https://discord.gg/J8BVvnsWeB'}
        ],
        footer: {
            message: 'Released under the GPL License.',
            releaseNote: 'https://github.com/YangQuan666/yangquan666.github.io/blob/main/CHANGELOG.md',
            version: version
        }
    },
    markdown: {
        config: (md) => {
        }
    }
}