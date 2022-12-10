import {buildSummary} from './theme/plugins/metadata.js'
import {biGithub, biTelegram, biTwitter} from '@quasar/extras/bootstrap-icons'

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
            {title: 'Home', link: '/', icon: 'home'},
            {title: 'Game', link: '/game/', icon: 'smart_toy'},
            {title: 'Tool', link: '/tool/', icon: 'api'},
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