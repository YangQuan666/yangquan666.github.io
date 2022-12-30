<template>
  <ul v-for="head in headers">

    <li>
      <q-item
          dense
          clickable
          :href="head.link"
          :key="path + head.link"
          :active="path + head.link === uniqueItemKey"
          @click="onItemClick(path, head.link)"
          style="border-radius: 8px 0 0 8px"
      >
        <q-item-section>{{ head.title }}</q-item-section>
      </q-item>
    </li>

    <template v-if="head.children && head.children.length">
      <OutlineItem :headers="head.children" :path="path+ head.link"></OutlineItem>
    </template>

  </ul>
</template>

<script lang="ts" setup>
import {useData} from "vitepress";
import {uniqueItemKey} from '../composables/outline.js'

const props = defineProps({headers: Array, path: String});
const {theme} = useData()

const onItemClick = (path, link) => {
  uniqueItemKey.value = path + link
}

</script>