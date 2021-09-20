// @ts-check
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const postDir = path.resolve(__dirname, '../../../posts')
const cache = new Map()

/**
 * @param {string} file
 */
function getPost(file) {
    const fullePath = path.join(postDir, file)
    const timestamp = fs.statSync(fullePath).mtimeMs

    const cached = cache.get(fullePath)
    if (cached && timestamp === cached.timestamp) {
        return cached.post
    }

    const src = fs.readFileSync(fullePath, 'utf-8')
    const {data, excerpt} = matter(src, {excerpt: true})
    const post = {
        title: data.title,
        href: `/posts/${file.replace(/\.md$/, '.html')}`,
        date: formatDate(data.date),
        excerpt
    }

    cache.set(fullePath, {
        timestamp,
        post
    })
    return post
}

function getPosts() {
    return fs
        .readdirSync(postDir)
        .filter(file => file.match(/\.md$/))
        .map((file) => getPost(file))
        .sort((a, b) => b.date.time - a.date.time)
}

/**
 * @param {string | number | Date} date
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    date.setUTCHours(12)
    return {
        time: +date,
        string: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

function genMetadata() {
    fs.writeFileSync(
        path.resolve(__dirname, postDir + '/metadata.json'),
        JSON.stringify(getPosts())
    )
}


exports.getPosts = getPosts
exports.genMetadata = genMetadata
