module.exports = {
    title: 'YangQuan\'s blog',
    description: 'YangQuan666\'s person blog site',
    lang: 'zh-CN',
    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ],
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about/' },
            { text: 'Tags', link: '/tags/' },
            { text: 'Archive', link: '/archive/' },
            { text: 'Contact', link: '/contact/' },
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
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        repo: '',
        repoLabel: 'Github',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: 'Edit this page on Github',
        serviceWorker: {
            updatePopup: {
                message: "New content is available.",
                buttonText: "Refresh"
            }
        }
    },
}