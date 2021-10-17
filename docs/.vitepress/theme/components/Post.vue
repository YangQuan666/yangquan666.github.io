<template>
  <Content/>
  <!-- place QPageScroller at end of page -->
  <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
    <q-btn fab icon="keyboard_arrow_up" color="accent"/>
  </q-page-scroller>
</template>
<script setup>
import {useData} from 'vitepress';
import {ref} from 'vue';

const {page} = useData();
const drawer = ref();
</script>