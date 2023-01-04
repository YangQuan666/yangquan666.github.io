import {ref} from 'vue'
// 全局状态，创建在模块作用域下
export const isPost = ref<boolean>(false)
export const outlineDraw = ref(false)

export function toggle() {
    outlineDraw.value = !outlineDraw.value
}

/**
 * 计算阅读大概时间
 * @param el 文章所在的html元素
 */
export function readingTime(el: HTMLElement) {
    const text = el.innerText;
    const wpm = 75;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm)
}