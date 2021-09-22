<template>
  <v-app :theme="mode">
    <NavBar :drawer="drawer"/>
    <AppBar @click="drawer = !drawer"/>
    <v-main>
      <v-container>
        <Timeline v-if="isIndex"/>
        <Post v-else/>
      </v-container>
    </v-main>

    <!--footer-->
    <v-footer padless>
      <span>&copy; {{ new Date() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import {ref, computed} from "vue"
import {useRoute} from "vitepress"
import {mode} from './plugins/theme'
import Post from "./components/Post.vue"
import NavBar from "./components/NavBar.vue"
import Timeline from "./components/Timeline.vue";
import AppBar from "./components/AppBar.vue";

const drawer = ref(null)

const route = useRoute()
const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')

</script>