import {ref} from 'vue'
import {Router} from "vitepress/dist/client";
// 全局状态，创建在模块作用域下
export const isPost = ref<boolean>(false)
// 加载进度条
export const progress = ref(false)
// 目录抽屉
export const outlineDraw = ref(false)

export function toggle() {
    outlineDraw.value = !outlineDraw.value
}

export function initRouter(router: Router) {
    router.onBeforeRouteChange = () => {
        progress.value = true
    }
    router.onAfterRouteChanged = () => {
        progress.value = false
    }
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