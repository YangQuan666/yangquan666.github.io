/**
 * 计算阅读大概时间
 * @param el 文章所在的html元素
 */
export function readingTime(el: HTMLElement) {
    const text = el.innerText;
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm)
}