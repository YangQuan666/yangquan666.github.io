<template>
  <v-navigation-drawer v-model="drawer" app>
    <!-- 个人信息展示 -->
    <v-col align-self="stretch">
      <v-row>
        <v-avatar size="250">
          <v-img src="avatar.png"></v-img>
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
      <v-list-item
          v-for="item in nav"
          :key="item"
          @click="router.go(item.link)">
        <v-icon>{{ item.icon }}</v-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {useData, useRouter} from "vitepress"

const props = defineProps<{ drawer?: boolean }>()

const {site} = useData()
const {themeConfig: {nav}} = site.value;
const router = useRouter()
</script>