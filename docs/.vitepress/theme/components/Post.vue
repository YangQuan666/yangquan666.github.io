<template>
  <div>
    <ul>
      <li v-for="item in page.headers" :key="item">
        <a
          class="level level-2"
          v-if="item.level == 2"
          :href="'#' + item.slug"
          >{{ item.title }}</a
        >
        <a
          class="level level-3"
          v-if="item.level == 3"
          :href="'#' + item.slug"
          >{{ item.title }}</a
        >
      </li>
    </ul>
    <Content />
  </div>
</template>
<script setup>
import { useData } from "vitepress"

const { page } = useData()
</script>