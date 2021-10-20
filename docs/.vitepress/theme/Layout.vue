<template>
  <q-layout view="hHh LpR lfr">

    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" @click="drawer = !drawer"/>

        <q-toolbar-title shrink class="row items-center no-wrap">
          <span class="q-ml-sm">Yang Quan</span>
        </q-toolbar-title>
        <q-space/>

        <q-input class="gt-xs" dense v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''"/>
          </template>
        </q-input>

        <q-space/>

        <q-btn flat round icon="menu" @click="toc = !toc"/>
        <q-btn flat round icon="search"/>
        <q-btn flat round icon="more_vert"/>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above
        no-swipe-close
        elevated
        side="left"
    >
      <q-scroll-area class="fit">
        <q-img src="https://cdn.quasar.dev/img/material.png">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="150px" class="q-mb-sm">
              <img src="/avatar.png" alt="avatar">
            </q-avatar>
            <div class="text-weight-bold">{{ themeConfig.author }}</div>
            <div>{{ themeConfig.email }}</div>
          </div>
        </q-img>

        <q-list padding class="q-item">
          <q-item
              v-for="item in nav"
              :key="item"
              @click="router.go(item.link)"
              :active="route.path === item.link"
              clickable
              v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="item.icon"/>
            </q-item-section>

            <q-item-section>
              {{ item.title }}
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer show-if-above v-model="toc" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/"/>
          <q-breadcrumbs-el label="Docs" icon="widgets" to="/start/pick-quasar-flavour"/>
          <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" to="/vue-components/breadcrumbs"/>
          <q-breadcrumbs-el label="Build" icon="build"/>
        </q-breadcrumbs>
      </div>
      <q-page padding>
        <Debug/>
        <Timeline v-if="isIndex"/>
        <Post v-else/>
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Footer</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref, computed} from 'vue'
import {useData, useRoute, useRouter} from "vitepress"
import {useQuasar} from 'quasar'

import Post from "./components/Post.vue"
import Timeline from "./components/Timeline.vue";

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {site} = useData()

const drawer = ref(false)
const toc = ref(false)

const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')

const {themeConfig} = site.value;
const {nav} = themeConfig
const search = ref('')
</script>
<style scoped>
.q-item {
  border-radius: 0 32px 32px 0;
}
</style>