<template>
  <v-app-bar
      shrink-on-scroll
      prominent
      fade-img-on-scroll
      app
  >
    <v-app-bar-nav-icon @click="emit('click')"/>

    <v-app-bar-title>{{ site.title }}</v-app-bar-title>

    <v-spacer/>

    <v-btn icon="mdi-magnify"/>

    <v-btn icon="mdi-theme-light-dark" @click="toggle"/>

    <v-btn icon="mdi-dots-vertical"/>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useData} from 'vitepress'
import {toggle} from '../plugins/theme'

const {site} = useData()
const emit = defineEmits(['click'])
</script>