import {buildSummary} from './theme/composables/metadata'
import {biAlipay, biDiscord, biGithub, biMastodon} from '@quasar/extras/bootstrap-icons'
import {version} from '../../package.json'
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
// @ts-ignore
import MarkdownIt from 'markdown-it';

buildSummary()

export default {
    title: '萨科的魔术盒',
    description: 'YangQuan的个人博客网站',
    lang: 'zh-CN',
    head: [
        ['meta', {name: 'viewport', content: 'user-scalable=0, initial-scale=1, maximum-scale=1, width=device-width'}],
        ['meta', {name: 'google-site-verification', content: 'RAVRlhHFJKHyrrg75VIxZPLEm6Vy7g846tY7WCmvQmA'}],
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
    markdown: {
        config: (md: MarkdownIt) => {
            md.renderer.rules.image = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
                const token = tokens[idx]
                const url = token.attrGet('src')
                const alt = token.attrGet('alt')
                return `<q-img src="${url}" alt="${alt}" style="max-height: 400px" loading="lazy" fit="contain"/>`
            }
            // md.renderer.rules.table_open = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
            //     return '<q-markup-table separator="cell"><table>'
            // }
            // md.renderer.rules.table_close = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
            //     return '</table></q-markup-table>'
            // }
        }
    }
}