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
    <OutlineItem :headers="headers" :path="'/'"/>
  </q-drawer>
</template>

<script lang="ts" setup>
import {useData} from "vitepress";
import {inject, onUpdated, ref, Ref} from "vue";
import {getHeaders, uniqueItemKey} from "../composables/outline.js";
import OutlineItem from "./OutlineItem.vue";

defineProps({headers: Array})
const {theme} = useData()
const headers = ref([])
const draw = ref(false)
const onContentUpdated = inject('onContentUpdated') as Ref<() => void>
onContentUpdated.value = () => {
  headers.value = getHeaders(theme.value.outline)
}
onUpdated(() => {
  uniqueItemKey.value = null
})
</script>