<template>
  <v-timeline>
    <v-timeline-item
        v-for="item in metadata"
        :key="item"
    >
      <template v-slot:opposite>
        <span>{{ new Date(item.time).toLocaleDateString() }}</span>
      </template>
      <v-card class="elevation-2">
        <v-card-title class="text-h5">{{ item.title }}</v-card-title>
        <v-card-text>{{ item.excerpt }}</v-card-text>
        <v-btn variant="outlined" color="primary" @click="router.go(item.link)">
          阅读全文
        </v-btn>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import {useRouter} from 'vitepress'
import metadata from '../../../posts/metadata.json'

const router = useRouter()
</script>