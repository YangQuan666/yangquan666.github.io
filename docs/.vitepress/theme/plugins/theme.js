import { ref } from "vue";

export const theme = ref()
// 切换主题
export function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light"
}

// 获取系统主题
export function initTheme() {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = darkTheme.matches ? 'dark' : 'light';
    return theme;
}

// 监听系统主题更改
export function themeChangeListener() {
    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            theme.value = e.matches ? "dark" : "light";
        });
}