import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import { mdiGithub, mdiRss, mdiEmail, mdiGamepadCircleUp, mdiNumeric2BoxMultiple, mdiToolbox, mdiCalendarToday } from '@mdi/js'
import { Feed } from 'feed'
import path from 'path'
import fs from 'fs'

const hostname: string = 'https://yangquan666.github.io'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "萨科的魔盒",
    description: "YangQuan的个人博客网站",
    lang: 'zh-CN',
    head: [
        // [
        //     'link',
        //     { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css' }
        // ]
    ],
    appearance: true,
    themeConfig: {
        logo: '/logo.svg',
        author: 'Yang Quan',
        signature: '一个爱折腾的程序员 )=￣ω￣=)',
        socialLinks: [
            { icon: mdiGithub, link: 'https://github.com/YangQuan666' },
            { icon: mdiRss, link: 'http://yangquan666.github.io/feed.xml' },
            { icon: mdiEmail, link: 'mailto:quark.yeung@icloud.com' }
        ],
        nav: [
            {
                title: '游戏', icon: mdiGamepadCircleUp, items: [
                    // {title: 'Chrome Dinosaur', icon: 'mdi-google-downasaur', link: '/game/dinosaur/'},
                    { title: '2048', icon: mdiNumeric2BoxMultiple, link: '/game/2048/' }
                ]
            }, {
                title: '工具', icon: mdiToolbox, items: [
                    { title: '历史上的今天', icon: mdiCalendarToday, link: '/tool/history/' },
                    // {title: 'flag', icon: 'mdi-flag-checkered', link: '/tool/flag/'}
                ]
            }
        ],
        outline: 'deep',
        footer: {
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
        headers: { level: [2, 3, 4, 5, 6] },
    },
    // sitemap: {
    //     hostname: hostname
    // },
    buildEnd: async (siteConfig: SiteConfig) => {
        const feed = new Feed({
            title: siteConfig.site.title,
            description: siteConfig.site.description,
            id: hostname,
            link: hostname,
            language: 'en',
            favicon: `${hostname}/favicon.ico`,
            image: `${hostname}/avatar.webp`,
            copyright: 'Released under the GPLv3 License. Copyright © 2019-present, YangQuan666'
        });


        const posts = await createContentLoader('post/*.md', {
            excerpt: true,
            render: true
        }).load()

        posts.sort(
            (a, b) =>
                +new Date(b.frontmatter.date as string) -
                +new Date(a.frontmatter.date as string)
        )

        for (const { url, excerpt, frontmatter, html } of posts) {
            if (frontmatter.display === false) continue;
            feed.addItem({
                title: frontmatter.title,
                id: `${hostname}${url}`,
                link: `${hostname}${url}`,
                description: frontmatter.excerpt,
                date: frontmatter.date
            })
        }
        const rssPath = path.join(siteConfig.outDir, 'feed.xml');
        fs.writeFileSync(rssPath, feed.rss2());
    }
})
