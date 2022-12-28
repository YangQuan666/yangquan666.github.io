<template>
  <q-layout view="hHh LpR lfr">

    <q-header elevated>
      <Toolbar :drawer="drawer" @updateDrawer="updateDrawer"/>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above
        no-swipe-open
        no-swipe-close
        elevated
        side="left"
    >
      <q-scroll-area class="fit">
        <q-img src="/material.png" height="300px">
          <div class="absolute-bottom bg-transparent" style="text-align: center">
            <q-avatar size="150px" class="q-mb-sm">
              <img src="/avatar.png" alt="avatar">
            </q-avatar>
            <div class="text-weight-bold">{{ themeConfig.author }}</div>
            <div>{{ themeConfig.signature }}</div>
            <div class="row">
              <div v-for="item in socialLinks" class="col" style="text-align: center">
                <q-btn flat round :color="item.color" :icon="item.icon" :href="item.link"/>
              </div>
            </div>
          </div>
        </q-img>
        <q-expansion-item
            padding
            default-opened
            v-for="item in nav"
            :key="item"
            :icon="item.icon"
            :label="item.title"
            :hide-expand-icon="!item.children"
            @click="drawerClick(item.link)"
            :header-class="{'text-primary': route.path === '/' && item.link === '/'}"
        >
          <q-item
              v-for="child in item.children"
              :key="child"
              @click="drawerClick(child.link)"
              :active="route.path.includes(child.link)"
              clickable
              v-ripple
          >
            <q-item-section avatar/>
            <q-item-section>
              {{ child.title }}
            </q-item-section>
            <q-item-section avatar>
              <q-icon :name="item.icon"/>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-scroll-area>

    </q-drawer>

    <q-page-container>
      <q-page padding>
        <Timeline v-if="route.path === '/'"/>
        <Post v-else-if="route.path.startsWith('/post')"/>
        <Content v-else />
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-dark text-white">
      <q-toolbar>
        {{ footer.message }}
        <q-space/>
        {{ footer.copyright }}
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useData, useRoute, useRouter} from 'vitepress'

import Post from './components/Post.vue'
import Timeline from './components/Timeline.vue';
import Toolbar from "./components/Toolbar.vue";
import {useQuasar} from "quasar";

const route = useRoute()
const router = useRouter()
const {site} = useData()
const $q = useQuasar()

const drawer = ref(false)
const updateDrawer = () => {
  drawer.value = !drawer.value
}
const drawerClick = (href) => {
  router.go(href)
  if ($q.screen.lt.md) {
    drawer.value = false
  }
}
const {themeConfig} = site.value;
const {nav, socialLinks, footer} = themeConfig
</script>