<template>
  <v-navigation-drawer location="right" expand-on-hover v-model="drawer">
    <v-list density="compact">
      <v-list-subheader class="justify-center">目录</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="{ level, title, link } in outline" :value="link" :href="link" :key="title">
        <v-list-item-title :class="[
          'ps-3 text-medium-emphasis',
          {
            'text-primary router-link-active': activeItem === link,
            'ps-6': level === 3,
            'ps-9': level === 4,
            'ps-12': level === 5,
            'ps-15': level === 6,
          }
        ]">
          {{ title }}
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
  <v-parallax :src="frontmatter.background ? frontmatter.background : '/background.svg'" height="500px">

    <div class="d-flex flex-column fill-height justify-center align-center">
      <div class="text-h4 font-weight-bold mb-4">
        {{ page.title }}
      </div>
      <div class="subheading">
        <v-icon>mdi-calendar</v-icon>
        最近更新: {{ useDateFormat(page.lastUpdated, 'YYYY-MM-DD') }}
      </div>
    </div>
  </v-parallax>
  <v-container>
    <Content class="vp-doc" />
  </v-container>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDateFormat } from '@vueuse/core'

const { page, frontmatter } = useData()
const route = useRoute()
const drawer = ref()
const activeItem = ref('')
const flattenJson = (data) => {
  const result = []
  const recursiveFlatten = (items) => {
    for (const item of items) {
      // 将当前项目添加到结果中
      result.push({
        level: item.level,
        title: item.title,
        slug: item.slug,
        link: item.link
      })
      // 如果有子项目，递归调用
      if (item.children && item.children.length > 0) {
        recursiveFlatten(item.children)
      }
    }
  }
  recursiveFlatten(data)
  return result
}

const outline = computed(() => flattenJson(page.value.headers ?? []))
const activeStack = []
let observer

const observeHeaders = () => {
  activeItem.value = ''
  activeStack.splice(0)
  observer?.disconnect()
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !activeStack.includes(entry.target)) {
        activeStack.push(entry.target)
      } else if (!entry.isIntersecting && activeStack.includes(entry.target)) {
        activeStack.splice(activeStack.indexOf(entry.target), 1)
      }
      const href = activeStack.at(0)?.querySelector('a')?.getAttribute('href')
      activeItem.value = href || activeItem.value
    })
  })

  const headers = [
    ...document.querySelectorAll('.vp-doc :where(h1,h2,h3,h4,h5,h6)')
  ]
  headers.forEach(item => observer.observe(item))
}

onMounted(observeHeaders)

watch(() => route.path, async () => {
  await nextTick()
  observeHeaders()
})

onBeforeUnmount(() => observer?.disconnect())
</script>
