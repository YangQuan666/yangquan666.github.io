<template>
  <ul v-for="head in headers">

    <li>
      <q-item
          dense
          clickable
          :key="path + head.link"
          :active="isActivate(path, head.link)"
          active-class="q-bar"
          @click="onItemClick(path, head.link)"
          style="border-radius: 8px 0 0 8px"
      >
        <q-item-section>{{ head.title }}</q-item-section>
      </q-item>
    </li>

    <template v-if="head.children && head.children.length">
      <OutlineItem :headers="head.children" :path="path + head.link"></OutlineItem>
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

// function handleClick({ target: el }: Event) {
//   // console.log(((el as HTMLAnchorElement).parentElement as HTMLAnchorElement).href)
//   const id = '#' + ((el as HTMLAnchorElement).parentElement as HTMLAnchorElement).href!.split('#')[1]
//   const heading = document.querySelector<HTMLAnchorElement>(
//       decodeURIComponent(id)
//   )
//   heading?.focus()
//   console.log(heading)
// }
const isActivate = (path, link) => {
  return path + link === uniqueItemKey.value
}
</script>