import fs from 'fs'
import path from 'path'
import matter from 'front-matter'
import {date} from 'quasar'

const postDir = path.resolve('docs/post/')

/**
 *
 * @param file md文章
 * @returns {{link: string, time: string, title, excerpt: *}|null} 文章的摘要信息
 */
function getPost(file: string) {
    const fullPath = path.join(postDir, file)

    const src = fs.readFileSync(fullPath, 'utf-8')
    const {attributes}: any = matter(src)

    if (attributes.display === false) {
        return null;
    }
    return {
        title: attributes.title,
        link: `/post/${file.replace(/\.md$/, '')}`,
        time: date.formatDate(attributes.date, 'YYYY-MM-DD'),
        excerpt: attributes.excerpt
    };
}

function getPosts() {
    return fs
        .readdirSync(postDir)
        .filter(file => file.match(/\.md$/))
        .map(file => getPost(file))
        .filter(json => json != null)
        .sort((a: any, b: any) => Date.parse(b.time) - Date.parse(a.time))
}


export function buildSummary() {
    fs.writeFileSync(postDir + '/summary.json', JSON.stringify(getPosts()))
}