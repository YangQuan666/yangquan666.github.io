import { ref } from "vue"

const theme = ref();
// 系统主题监听器
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    theme.value = e.matches ? "dark" : "light"
});
// 初始为系统默认主题
function initTheme() {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = darkTheme.matches ? 'dark' : 'light';
    return theme;
}
export default {
    theme: theme,
    initTheme: () => initTheme(),
    toggleTheme: () =>
        (theme.value = theme.value === "light" ? "dark" : "light")
}