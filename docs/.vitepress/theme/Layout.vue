<template>
  <v-app :theme="theme">
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav dense>
        <v-list-item>
          <v-icon>mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>Account</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      shrink-on-scroll
      prominent
      src="https://picsum.photos/200/300/?blur"
      fade-img-on-scroll
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-magnify" />

      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" />

      <v-btn icon=mdi-dots-vertical />
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

<script setup>
import { ref } from "vue"
import {theme, toggleTheme} from './plugins/theme'
import Post from "./components/Post.vue"

const drawer = ref()
</script>