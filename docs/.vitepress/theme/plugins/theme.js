import {ref} from 'vue';

export const mode = ref()

export function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
}

export function initTheme() {
    if (typeof window !== 'undefined') {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
        mode.value = darkMode.matches ? 'dark' : 'light';
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                mode.value = e.matches ? 'dark' : 'light';
            });
    }
}

