<script lang="ts" setup>
import { ref } from 'vue';

// const { locale } = useI18n();
const toggleLocale = () => {
  // locale.value = locale.value === LOCALE.CN ? LOCALE.EN : LOCALE.CN;
  // document.documentElement.setAttribute('lang', locale.value);
}


enum THEME {
  DARK = 'dark',
  LIGHT = 'light'
}

const theme = ref<THEME>();

const switchTheme = (value: THEME) => {
  theme.value = value;
  document.body.setAttribute('theme', value);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  switchTheme(THEME.DARK);
} else {
  switchTheme(THEME.LIGHT);
}
</script>

<template>
  <div class="switcher-wrapper">
    <div class="theme" :title="$t('message.switch_theme')">
      <i v-show="theme === THEME.DARK" class="theme-light icon" @click="switchTheme(THEME.LIGHT)">
        <svg t="1662293613231" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4178"
          xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">
          <path
            d="M508.475476 777.927066a262.879 262.879 0 1 0 14.927684-525.546038 262.879 262.879 0 1 0-14.927684 525.546038Z"
            p-id="4179"></path>
          <path
            d="M512.119 213.154c17.673 0 32-14.327 32-32V95.896c0-17.673-14.327-32-32-32-17.673 0-32 14.327-32 32v85.258c0 17.673 14.327 32 32 32zM743.779 308.938c8.186 0.232 16.461-2.658 22.884-8.727l61.973-58.553c12.845-12.137 13.42-32.391 1.283-45.237-12.139-12.846-32.391-13.421-45.237-1.283l-61.973 58.553c-12.845 12.137-13.42 32.391-1.283 45.237 6.069 6.422 14.167 9.777 22.353 10.01zM936.04 487.929l-85.224-2.417c-17.666-0.501-32.393 13.414-32.894 31.08-0.501 17.666 13.414 32.394 31.08 32.895l85.224 2.417c17.666 0.501 32.393-13.415 32.894-31.08 0.501-17.667-13.414-32.394-31.08-32.895zM773.672 730.999c-12.137-12.846-32.391-13.42-45.237-1.284-12.846 12.138-13.421 32.391-1.284 45.237l58.552 61.972c6.069 6.424 14.166 9.779 22.353 10.011 8.185 0.232 16.462-2.659 22.884-8.727 12.846-12.138 13.421-32.391 1.284-45.237l-58.552-61.972zM514.455 817.14c-17.666-0.501-32.393 13.414-32.894 31.08l-2.417 85.224c-0.501 17.666 13.414 32.393 31.08 32.894 17.666 0.501 32.393-13.414 32.894-31.08l2.417-85.224c0.501-17.665-13.414-32.393-31.08-32.894zM256.094 726.369l-61.972 58.553c-12.846 12.138-13.42 32.391-1.283 45.237 6.069 6.425 14.165 9.779 22.353 10.011 8.185 0.232 16.461-2.659 22.884-8.727l61.972-58.553c12.846-12.138 13.42-32.391 1.283-45.237-12.138-12.848-32.391-13.42-45.237-1.284zM213.906 513.673c0.501-17.666-13.414-32.393-31.08-32.894l-85.224-2.417c-17.666-0.501-32.393 13.414-32.894 31.08-0.501 17.666 13.414 32.393 31.08 32.894l85.224 2.417c17.665 0.501 32.393-13.414 32.894-31.08zM258.157 299.266c6.069 6.423 14.166 9.778 22.353 10.01 8.186 0.232 16.461-2.658 22.884-8.727 12.846-12.137 13.42-32.39 1.283-45.237l-58.553-61.972c-12.138-12.846-32.39-13.421-45.237-1.283-12.846 12.137-13.42 32.391-1.283 45.237l58.553 61.972z"
            p-id="4180"></path>
        </svg>

      </i>
      <i v-show="theme === THEME.LIGHT" class="theme-dark icon" @click="switchTheme(THEME.DARK)">
        <svg t="1662293594971" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3246"
          xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">
          <path
            d="M524.8 938.666667h-4.266667a439.893333 439.893333 0 0 1-313.173333-134.4 446.293333 446.293333 0 0 1-11.093333-597.333334 432.213333 432.213333 0 0 1 170.666666-116.906666 42.666667 42.666667 0 0 1 45.226667 9.386666 42.666667 42.666667 0 0 1 10.24 42.666667 358.4 358.4 0 0 0 82.773333 375.893333 361.386667 361.386667 0 0 0 376.746667 82.773334 42.666667 42.666667 0 0 1 54.186667 55.04A433.493333 433.493333 0 0 1 836.266667 810.666667a438.613333 438.613333 0 0 1-311.466667 128z"
            p-id="3247"></path>
        </svg>
      </i>
    </div>

    <div class="locale" @click="toggleLocale">
      <span>{{ locale === LOCALE.CN ? 'English' : '中文' }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.switcher-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-block-start: 10px;
  margin-inline-end: 10%;
  width: 100%;

  .theme {
    cursor: pointer;

    .icon {
      display: inline-block;
      user-select: none;

      svg {
        width: 24px;
        height: 24px;
        fill: var(--theme-color);
      }
    }
  }

  .locale {
    margin-block-start: -6px;
    margin-inline-start: 12px;
    cursor: pointer;
  }
}
</style>
