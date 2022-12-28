<template>
  <q-toolbar>
    <q-btn flat round icon="menu" @click="$emit('updateDrawer')"/>

    <q-toolbar-title
        shrink
        class="row items-center no-wrap"
    >
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="logo">
      </q-avatar>
      <span class="q-ml-sm">{{site.themeConfig.title}}</span>
    </q-toolbar-title>
    <q-space/>

    <q-input
        dark
        standout bottom-slots
        v-model="keyword"
        placeholder="Search"
        dense hide-bottom-space
        class="search-field"
        v-bind:class='{ "search-closed": searchClose}'
        @blur="searchClose = true"
        @focus="searchClose = false"
    >
      <template #prepend>
        <q-icon name="search" class="cursor-pointer"></q-icon>
      </template>
    </q-input>
    <q-space class="gt-sm"/>
    <q-btn v-if="必须是在post页面中" flat round icon="toc" class="lt-md" @click="$emit('')"/>
  </q-toolbar>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useData} from "vitepress";

defineProps({drawer: Boolean})
const {site} = useData()
const searchClose = ref(true)

const keyword = ref('')
</script>