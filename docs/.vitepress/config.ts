import {buildSummary} from './theme/composables/metadata'
import {biAlipay, biDiscord, biGithub, biMastodon} from '@quasar/extras/bootstrap-icons'
import {version} from '../../package.json'
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
// @ts-ignore
import MarkdownIt from 'markdown-it';
import {createWriteStream} from "fs";
import {resolve} from 'node:path'
import {SitemapStream} from 'sitemap'
import {SiteConfig} from 'vitepress/dist/node';

buildSummary()

const links: any[] = []
export default {
    title: '萨科的魔术盒',
    description: 'YangQuan的个人博客网站',
    lang: 'zh-CN',
    head: [
        ['meta', {name: 'viewport', content: 'user-scalable=0, initial-scale=1, maximum-scale=1, width=device-width'}],
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
        ['link', {rel: 'me', href: 'https://mastodon.social/@Kourtsis'}]
    ],
    lastUpdated: true,
    themeConfig: {
        author: 'Yang Quan',
        signature: '一个爱折腾的程序员 )=￣ω￣=)',
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
    cleanUrls: 'without-subfolders',
    transformHtml: (_: any, htmlFileName: string, {pageData} : any) => {
        if (!/[\\/]404\.html$/.test(htmlFileName) && pageData.frontmatter.display !== false)
            links.push({
                // you might need to change this if not using clean urls mode
                url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
                lastmod: pageData.lastUpdated
            })
    },
    async buildEnd(siteConfig: SiteConfig) {
        const sitemap = new SitemapStream({
            hostname: 'https://yangquan.netlify.app/'
        })
        const writeStream = createWriteStream(resolve(siteConfig.outDir, 'sitemap.xml'))
        sitemap.pipe(writeStream)
        links.forEach((link) => sitemap.write(link))
        sitemap.end()
        await new Promise((r) => writeStream.on('finish', r))
    },
    markdown: {
        config: (md: MarkdownIt) => {
            md.renderer.rules.image = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
                const token = tokens[idx]
                const url = token.attrGet('src')
                const alt = token.attrGet('alt')
                return `<q-img src="${url}" alt="${alt}" style="max-height: 400px" loading="lazy" fit="contain"/>`
            }
        }
    }
}