import { ref } from "vue";

export const mode = ref()
// 切换主题
export function toggle() {
    mode.value = mode.value === "light" ? "dark" : "light"
}

// 获取系统主题
export function initTheme() {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    return darkMode.matches ? 'dark' : 'light';
}

// 监听系统主题更改
export function themeChangeListener() {
    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            mode.value = e.matches ? "dark" : "light";
        });
}