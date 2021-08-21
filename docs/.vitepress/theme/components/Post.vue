<template>
  <ul>
    <li v-for="item in page.headers" :key="item">
      <a class="level level-2" v-if="item.level == 2" :href="'#' + item.slug">{{
        item.title
      }}</a>
      <a class="level level-3" v-if="item.level == 3" :href="'#' + item.slug">{{
        item.title
      }}</a>
    </li>
  </ul>
  <Content />
</template>
<script>
import { useData } from "vitepress";
export default {
  setup() {
    const { page } = useData();
    return {
      page
    }
  },
};
</script>