// import {genMetadata} from './theme/plugins/metadata'
// genMetadata()

export default {
    title: 'YangQuan\'s blog',
    description: 'YangQuan666\'s person blog site',
    lang: 'zh-CN',
    head: [
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
    ],
    themeConfig: {
        nav: [
            {title: 'Home', link: '/', icon: 'home'},
            {title: 'Java', link: '/java/', icon: 'code'},
            {title: 'Phone', link: '/phone/', icon: 'devices'},
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