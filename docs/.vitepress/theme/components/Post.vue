<template>
  <v-navigation-drawer v-model="drawer" right>
    <v-list>
      <template v-for="(item, index) in page.headers" :key="item">
        <v-list-item :href="'#' + item.slug">
          <div :class="`text-${classes[item.level]}`">{{ item.title }}</div>
        </v-list-item>
        <v-divider v-if="index < page.headers.length - 1" :key="index"/>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-btn
      v-if="!drawer"
      @click="drawer = !drawer"
      icon="mdi-format-list-bulleted-square"
      color="green"
  />
  <Content/>
</template>
<script setup>
import {useData} from 'vitepress';
import {ref} from 'vue';

const {page} = useData();
const drawer = ref();
const classes = ['h1', 'h2', 'h6', 'caption'];
</script>