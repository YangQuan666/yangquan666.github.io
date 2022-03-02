import fs from 'fs'
import path from 'path'
import matter from 'front-matter'

const postDir = path.resolve('docs/post/')

/**
 * @param {string} file
 */
function getPost(file) {
    const fullPath = path.join(postDir, file)

    const src = fs.readFileSync(fullPath, 'utf-8')
    const {attributes} = matter(src)

    return {
        title: attributes.title,
        link: `/post/${file.replace(/\.md$/, '.html')}`,
        time: attributes.date,
        excerpt: attributes.excerpt
    }
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