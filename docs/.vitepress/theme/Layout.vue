<template>
  <q-layout view="hHh LpR lfr">

    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" @click="drawer = !drawer"/>

        <q-toolbar-title shrink class="row items-center no-wrap">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="logo">
          </q-avatar>
          <span class="gt-sm">Yang Quan</span>
        </q-toolbar-title>
        <q-space/>

        <Search/>

        <q-space/>

        <Toolbar/>
      </q-toolbar>
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
        <q-img src="https://cdn.quasar.dev/img/material.png">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="150px" class="q-mb-sm">
              <img src="/avatar.png" alt="avatar">
            </q-avatar>
            <div class="text-weight-bold">{{ themeConfig.author }}</div>
            <div>{{ themeConfig.email }}</div>
          </div>
        </q-img>

        <q-list padding>
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

          <q-separator inset/>
          <p>这里会展示文章目录</p>

          <div class="row">
            <div v-for="item in socialLinks" class="col justify-around" align="center">
              <q-btn flat round :color="item.color" :icon="item.icon" :href="item.link"/>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
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
        <Timeline v-if="route.path === '/'"/>
        <Post v-else-if="route.path.startsWith('/post')"/>
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
import {ref} from 'vue'
import {useData, useRoute, useRouter} from 'vitepress'
import {useQuasar} from 'quasar'

import Post from './components/Post.vue'
import Timeline from './components/Timeline.vue';
import Search from './components/Search.vue';
import Toolbar from './components/Toolbar.vue';

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {site} = useData()

const drawer = ref(false)

const {themeConfig} = site.value;
const {nav, socialLinks} = themeConfig
</script>