import {genMetadata} from './theme/plugins/metadata.js'
genMetadata()

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
            {title: 'About', link: '/about/', icon: 'person'},
        ],
        sidebar: {
            '/tags/': [
                '',
                'vuetify',
                'vue',
                'nodejs',
                'git',
                'linux',
            ]
        }
    }
}