import fs from 'fs'
import path from 'path'
import matter from 'front-matter'
import {date} from 'quasar'

const postDir = path.resolve('docs/post/')

/**
 *
 * @param file 文章
 * @returns {{link: string, time: string, title, excerpt: (string|*)}} 文章的摘要信息
 */
function getPost(file) {
    const fullPath = path.join(postDir, file)

    const src = fs.readFileSync(fullPath, 'utf-8')
    const {attributes} = matter(src)

    return {
        title: attributes.title,
        link: `/post/${file.replace(/\.md$/, '.html')}`,
        time: date.formatDate(attributes.date, 'YYYY-MM-DD'),
        excerpt: attributes.excerpt
    };
}

function getPosts() {
    return fs
        .readdirSync(postDir)
        .filter(file => file.match(/\.md$/))
        .map((file) => getPost(file))
        .sort((a, b) => b.time - a.time)
}


export function genMetadata() {
    fs.writeFileSync(postDir + '/summary.json', JSON.stringify(getPosts()))
}