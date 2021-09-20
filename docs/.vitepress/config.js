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
            {text: 'Home', link: '/'},
            {text: 'About', link: '/about/'},
            {text: 'Tags', link: '/tags/'},
            {text: 'Archive', link: '/archive/'},
            {text: 'Contact', link: '/contact/'},
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