<template>
  <ul v-for="head in headers">

    <li>
      <q-item
          dense
          clickable
          :href="head.link"
          :key="head.link"
          :active="head.link === curItem"
          @click="onItemClick(head.link)"
          style="border-radius: 8px 0 0 8px"
      >
        <q-item-section>{{ head.title }}</q-item-section>
      </q-item>
    </li>

    <template v-if="head.children && head.children.length">
      <OutlineItem :headers="head.children"></OutlineItem>
    </template>

  </ul>
</template>

<script lang="ts" setup>
import {useData} from "vitepress";
import {ref} from "vue";

defineProps({headers: Array})
const {theme} = useData()

const curItem = ref(null)

const onItemClick = (link) => {
  curItem.value = link
}
</script>