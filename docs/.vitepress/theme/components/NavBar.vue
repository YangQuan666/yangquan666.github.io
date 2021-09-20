<template>
  <v-navigation-drawer v-model="drawer" app>
    <!-- 个人信息展示 -->
    <v-col align-self="stretch">
      <v-row>
        <v-avatar size="250">
          <v-img src="https://avatars.githubusercontent.com/u/27985301"></v-img>
        </v-avatar>
      </v-row>
      <v-row>
        <v-list-item>
          <!-- todo -->
          <div>
            <v-list-item-title class="title">Yang Quan</v-list-item-title>
            <v-list-item-subtitle>yangquan0705@gmail.com</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-row>
    </v-col>
    <v-divider/>
    <v-list nav dense>
      <v-list-item href="/">
        <v-icon>mdi-home</v-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item href="/posts/resume">
        <v-icon>mdi-account</v-icon>
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {useData} from "vitepress"

const props = defineProps<{ drawer?: boolean }>()

const {site} = useData()

</script>