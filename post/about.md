---
layout: 'post'
title: 关于这个博客
date: 2020-05-01
excerpt: "我为什么想自己做一个博客，以及我是怎么搭建起来这个博客网站的"
background: "/post/about/bg.png"
---
## 背景

哪个程序员不希望有一个自己的博客网站呢，我在毕业的时候就一直想做一个博客网站，
但是自己的拖延症太严重了👀，终于在2025年花了点时间，做了一个还凑合用的博客网站

## 定位

| 平台             | 说明                                       |
| ---------------- | ------------------------------------------ |
| 朋友圈           | 记录生活点滴，分享日常动态                 |
| 微博,小红书      | 分享短消息和实时动态，关注全球热点话题     |
| 抖音,B站,YouTube | 短视频分享平台，记录和分享生活中的有趣瞬间 |
| __个人博客网站__ | 分享技术类文章，个人长篇写作               |

## 功能亮点

| 特性     | 支持程度 | 解释                                                                                                                                                                             |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 响应式   | ✅        | 在不同尺寸的设备上展示不同的页面布局                                                                                                                                             |
| Dark模式 | ✅        | 支持dark和light两种模式，会自动检测当前系统的主题并适配，无需手动设置                                                                                                            |
| Markdown | ✅        | 支持直接渲染markdown文档为html页面，主题为仿GitHub的markdown样式                                                                                                                 |
| 全局搜索 | ✅        | 基于MiniSearch本地搜索，无需搭建后台服务器即可实现搜索功能                                                                                                                       |
| SEO优化  | ✅        | 是的，搜索引擎可以爬取到我的所有博客文章，极大提高了博客网站的访问量                                                                                                             |
| 评论系统 | 🚫        | 暂不打算支持，我认为`GitHub Discusstions`可以满足我的要求，因此如果你想留言建议在[这里](https://github.com/YangQuan666/yangquan666.github.io/discussions) 直接新建一个议题就可以 |


## 用到了哪些技术

> 站在巨人的肩膀，可以看得更远 --沃兹基·硕得

### GitHub Pages

搭建博客一直有个比不开的问题就是：博客部署到哪？自己买服务器，一年的费用也是比不小的开支，好在GitHub Pages免费提供了一个静态博客的方案

1. 新建一个git仓库，输入 `username.github.io` 作为存储库名称。 将 `username` 替换为你的 `GitHub` 用户名。 例如，如果用户名为  `octocat`，则存储库名称应为 `octocat.github.io`
2. 进入 **Setting - Pages - Build and deployment**，选择一个分支用作静态博客的部署分支，以我的博客为例：我有两个分支：`main` 分支用作代码提交，`gh-pages`分支用作存放编译后的静态文件，因此我在这里需要选择`gh-pages`分支
3. 至此就创建了一个静态博客，域名就是`https://username.github.io`
4. 使用github workflow自动将`main` 分支的最新代码编译后放在`gh-pages`分支：在`main` 分支新增文件`.github/workflow/deploy.yml`，需要用到`ACCESS_TOKEN`，申请步骤查看[这里](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
    ```yml [.vitepress/config.js]
    name: Build and Deploy
    on:
    push:
        branches:
        - v3
    jobs:
    build-and-deploy:
        runs-on: ubuntu-latest
        steps:
        - name: Checkout
            uses: actions/checkout@v4
            with:
            fetch-depth: 0

        - name: Install and Build
            run: |
            npm install
            npm run docs:build

        - name: Deploy
            uses: JamesIves/github-pages-deploy-action@4.1.3
            with:
            BRANCH: gh-pages
            FOLDER: .vitepress/dist
            ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        ```

### VitePress [🔗](https://vitepress.dev)
> VitePress 是一个静态站点生成器，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。
> VitePress 支持很多丰富的功能，详细可以查看[官方文档](https://vitepress.dev/zh/)

1. 使用如下命令快速生成一个vitepress项目
```shell
cd {你的git仓库目录中}
npm add -D vitepress
npx vitepress init
```

2. 启动并运行
```js [package.json]
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```
### Vuetify.js [🔗](https://vuetifyjs.com/zh-Hans/)
> Vuetify 是一个功能强大的 Vue 组件框架，每个组件都是根据 Google 的 Material Design 规范制作的，并提供数百个自定义选项，适合任何风格或设计。即使不是 Material Design也是如此。只需使用props、slots（插槽） 和 components（组件），或将它们结合使用，就能随心所欲地编写简洁或冗长的 Vue 模板。

可以直接引用我已经打包好的个人博客主题：`npm add -D vitepress-vuetify-theme @mdi/font`

### 其他

1.  **Netlify**：这时候你可能发现，直接访问github page速度不是很理想，因为github page部署在国外，需要科学的网络环境才可以正常访问，因此这里推荐使用免费的Netlify做一层代理，加速国内网站访问速度：https://www.netlify.com/
2. **Sitemap**：为什么网站很难在google搜到？因为google没有爬取你的网站信息，配置sitemap.xml并使用[google console](https://search.google.com/)来给你的网站建立索引，方便用户搜索