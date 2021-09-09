<template>
  <div>
    <v-navigation-drawer v-model="drawer" right>
      <v-list>
        <v-list-item v-for="item in page.headers" :key="item" :href="'#' + item.slug" link>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-btn icon="mdi-format-list-bulleted-square" color="green" @click="drawer = !drawer"></v-btn>
    <Content />
  </div>
</template>
<script setup>
import { useData } from "vitepress"
import { ref } from "vue"

const { page } = useData()
const drawer = ref()

</script>