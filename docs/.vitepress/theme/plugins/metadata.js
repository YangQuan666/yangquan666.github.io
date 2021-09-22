// @ts-check
const fs = require('fs')
const path = require('path')
const matter = require('front-matter')

const postDir = path.resolve(__dirname, '../../../posts/')

/**
 * @param {string} file
 */
function getPost(file) {
    const fullPath = path.join(postDir, file)

    const src = fs.readFileSync(fullPath, 'utf-8')
    const {attributes} = matter(src)

    return {
        title: attributes.title,
        link: `/posts/${file.replace(/\.md$/, '.html')}`,
        time: attributes.date.getTime(),
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


function genMetadata() {
    fs.writeFileSync(
        path.resolve(__dirname, postDir + '/metadata.json'),
        JSON.stringify(getPosts())
    )
}


exports.getPosts = getPosts
exports.genMetadata = genMetadata
