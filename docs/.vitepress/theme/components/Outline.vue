<template>
  <q-drawer
      no-swipe-open
      no-swipe-close
      show-if-above
      bordered
      side="right"
      v-model="draw"
  >
    <q-toolbar>
      <q-toolbar-title>目录</q-toolbar-title>
    </q-toolbar>
    <q-space/>
    <OutlineItem :headers="headers"/>
  </q-drawer>
</template>

<script lang="ts" setup>
import {useData} from "vitepress";
import {onUpdated, ref} from "vue";
import {uniqueItemKey} from "../composables/outline";
import OutlineItem from "./OutlineItem.vue";

defineProps({headers: Array});
const {theme} = useData()
// const headers = ref([])
const draw = ref(false)

onUpdated(() => {
  uniqueItemKey.value = null
})
</script>