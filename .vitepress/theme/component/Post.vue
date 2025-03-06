<template>
  <v-navigation-drawer location="right" expand-on-hover v-model="drawer">
    <v-list density="compact">
      <v-list-subheader>目录</v-list-subheader>
      <v-list-item
          v-for="{ level, title, link } in outline"
          :value="link" :href="link" :key="title"
      >
        <v-list-item-title :class="[
            'ps-3 text-medium-emphasis',
            {
              'text-primary router-link-active': activeItem === link.slice(1),
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
  <v-parallax
      :src="frontmatter.background ? frontmatter.background : '/background.svg'" height="500px"
  >

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
  <Content class="vp-doc"/>
</template>

<script setup>
import {useData} from 'vitepress'
import {ref} from 'vue'
import {useDateFormat} from '@vueuse/core'

const {page, frontmatter} = useData()
const drawer = ref()

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

const activeItem = ref('')
const outline = flattenJson(page.value.headers)
</script>