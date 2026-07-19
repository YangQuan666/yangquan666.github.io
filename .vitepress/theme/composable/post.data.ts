import { createContentLoader, type ContentData } from 'vitepress'

interface ArticleSummary {
    title: string
    excerpt: string
    date: string
    formattedDate: string
    url: string
}

const toTimestamp = (value: unknown) => {
    const timestamp = new Date(value as string).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
}

const formatDate = (value: unknown) => {
    const date = new Date(value as string)
    if (Number.isNaN(date.getTime())) return '日期待补充'

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const formatExcerpt = (value: unknown) => {
    const excerpt = String(value).replace(/\s+/g, ' ').trim()
    return excerpt.length > 90 ? `${excerpt.slice(0, 90)}…` : excerpt
}

export default createContentLoader('post/*.md', {
    transform(rawData: ContentData[]): ArticleSummary[] {
        return rawData
            .filter(page => page.frontmatter.display !== false)
            .filter(page => page.frontmatter.title && page.frontmatter.excerpt && page.frontmatter.date)
            .sort((a, b) => toTimestamp(b.frontmatter.date) - toTimestamp(a.frontmatter.date))
            .map(page => ({
                title: String(page.frontmatter.title),
                excerpt: formatExcerpt(page.frontmatter.excerpt),
                date: String(page.frontmatter.date),
                formattedDate: formatDate(page.frontmatter.date),
                url: page.url
            }))
    }
})
