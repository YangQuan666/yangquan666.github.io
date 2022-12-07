<template>
  <Layout>
    <Content/>
    <!-- place QPageScroller at end of page -->
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" @click="toc = !toc"/>
    </q-page-scroller>
    <q-drawer
        v-model="toc"
        side="right"
        show-if-above
        bordered>
      <!-- table of contents -->
    </q-drawer>
  </Layout>
</template>
<script setup>
import {useData} from 'vitepress';
import {ref} from 'vue';
import DefaultTheme from 'vitepress/theme'

const {page} = useData();

const toc = ref(false)

const {Layout} = DefaultTheme
</script>