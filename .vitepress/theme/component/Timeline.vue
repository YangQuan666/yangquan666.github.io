<template>
  <v-img
      class="align-center justify-center"
      height="400px"
      src="/map.svg"
      cover
  >
    <div class="text-center text-h3 font-weight-bold bg-secondary">When in doubt, use brute force.</div>
  </v-img>
  <v-timeline align="center">
    <v-timeline-item
        v-for="({title, excerpt, time, url}, i) in summary"
        :key="i"
        dot-color="info"
        size="small"
    >
      <template v-slot:opposite>
        <div
            class="pt-1 headline font-weight-bold"
            v-text="time"
        ></div>
      </template>
      <v-card variant="flat">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <p>{{ excerpt }}</p>
          <v-btn
              color="info"
              variant="plain"
              @click="router.go(url)"
          >
            阅读全文
          </v-btn>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>

</template>

<script setup>
import {useRouter} from 'vitepress'
import { data as summary } from '../composable/post.data'
const router = useRouter()
</script>

<style scoped>

</style>