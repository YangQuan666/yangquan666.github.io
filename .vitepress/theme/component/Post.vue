<template>
  <v-navigation-drawer location="right" v-model="drawer">
    <v-list>
      <v-list-item title="Drawer right" value="item01"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-parallax
      :src="frontmatter.background ? frontmatter.background : '/background.svg'" height="500px"
  >

    <div class="d-flex flex-column fill-height justify-center align-center">
      <div class="text-h4 font-weight-bold mb-4">
        {{ page.title }}
      </div>
      <div class="subheading">
        <v-icon>mdi-calendar</v-icon>
        最近更新: {{ date.format(page.lastUpdated, 'keyboardDate') }}
      </div>
    </div>
  </v-parallax>
  <Content class="vp-doc"/>
</template>

<script setup>
import {useData} from 'vitepress'
import {ref} from 'vue'
import {useDate} from 'vuetify'

const date = useDate()
const {page, frontmatter} = useData()
const drawer = ref()
</script>