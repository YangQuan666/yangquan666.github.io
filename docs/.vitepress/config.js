import {buildSummary} from './theme/plugins/metadata.js'
import {biGithub, biTelegram, biTwitter, biBrowserChrome} from '@quasar/extras/bootstrap-icons'

buildSummary()

export default {
    title: 'YangQuan\'s blog',
    description: 'YangQuan666\'s person blog site',
    lang: 'zh-CN',
    head: [
        ['meta', {name: 'viewport', content: 'user-scalable=no, initial-scale=1, width=device-width'}],
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}]
    ],
    themeConfig: {
        author: 'YangQuan',
        email: 'quark.yeung@icloud.com',
        nav: [
            {
                title: 'Home', link: '/', icon: 'home'
            },
            {
                title: 'Game', icon: 'smart_toy', children: [
                    {title: 'Chrome Dinosaur', link: '/game/dinosaur', icon: 'casino'},
                    {title: 'Flappy Bird', link: '/game/flappyBird', icon: 'casino'},
                    {title: '2048', link: '/game/2048', icon: 'casino'},
                ]
            },
            {
                title: 'Tool', link: '/tool/', icon: 'api', children: [
                    {title: 'Json Formatter', link: '/tool/jsonFormatter', icon: 'hive'},
                ]
            },
        ],
        socialLinks: [
            {icon: biGithub, color: 'null', link: 'https://github.com/YangQuan666'},
            {icon: biTwitter, color: 'blue-6', link: 'https://twitter.com/QuarkYeung'},
            {icon: biTelegram, color: 'light-blue-6', link: 'https://t.me/QuarkYeung'}
        ],
        footer: {
            message: 'Released under the GPL License.',
            copyright: 'Copyright © 2019-present Evan You'
        }
    }
}