<template>
  <q-toolbar>
    <q-toolbar-title>目录</q-toolbar-title>
  </q-toolbar>
  <q-space/>
  <OutlineItem :headers="headers" :path="'/'"/>

</template>

<script lang="ts" setup>
import {useData} from "vitepress";
import {inject, ref, Ref} from "vue";
import {getHeaders} from "../composables/outline.js";
import OutlineItem from "./OutlineItem.vue";


defineProps({headers: Array})
const {theme} = useData()
const headers = ref([])
const onContentUpdated = inject('onContentUpdated') as Ref<() => void>
onContentUpdated.value = () => {
  headers.value = getHeaders(theme.value.outline)
}
</script>