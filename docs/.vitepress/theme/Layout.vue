<template>
  <v-app :theme="mode">
    <NavBar :drawer="drawer" />
    <v-app-bar
      shrink-on-scroll
      prominent
      src="https://picsum.photos/200/300/?blur"
      fade-img-on-scroll
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ site.title }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-magnify" />

      <v-btn icon="mdi-theme-light-dark" @click="toggle" />

      <v-btn icon="mdi-dots-vertical" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Post />
      </v-container>
    </v-main>

    <!--footer-->
    <v-footer padless>
      <span>&copy; {{ new Date() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useData } from "vitepress"
import { mode, toggle } from './plugins/theme'
import Post from "./components/Post.vue"
import NavBar from "./components/NavBar.vue"

const { site } = useData()
console.log(useData());

const drawer = ref(null)
</script>