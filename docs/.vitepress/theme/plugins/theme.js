import {ref} from "vue";

export const mode = ref()

export function toggle() {
    mode.value = mode.value === "light" ? "dark" : "light"
}

export function initTheme() {
    if (isBrowser()) {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
        mode.value = darkMode.matches ? 'dark' : 'light';
    }
}

export function themeChangeListener() {
    if (isBrowser()) {
        window.matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                mode.value = e.matches ? "dark" : "light";
            });
    }
}


const isBrowser = () => typeof window !== "undefined"

initTheme()
themeChangeListener()
