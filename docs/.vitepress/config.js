// @ts-check
require('./theme/plugins/metadata.js').genMetadata()

module.exports = {
    title: 'YangQuan\'s blog',
    description: 'YangQuan666\'s person blog site',
    lang: 'zh-CN',
    head: [
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
    ],
    themeConfig: {
        nav: [
            {title: 'Home', link: '/', icon: 'mdi-home'},
            {title: 'Java', link: '/tags/',icon: 'mdi-language-java'},
            {title: 'Phone', link: '/tags/',icon: 'mdi-cellphone-iphone'},
            {title: 'About', link: '/about/', icon: 'mdi-account'},
        ],
        sidebar: {
            '/about/': [
                '',
                'introduction',
                'resume',
                'experience',
                'education',
                'skills',
                'hobbies',
                'links',
            ],
            '/tags/': [
                '',
                'vuetify',
                'vue',
                'nodejs',
                'git',
                'linux',
            ],
            '/archive/': [
                '',
                '2019',
                '2018',
                '2017',
            ]
        }
    },
}