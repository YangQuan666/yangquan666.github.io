<template>
  <v-img class="align-center justify-center" height="500px" src="/map.svg" cover>
    <div class="text-center text-h3 font-weight-bold">
      <span>Shit It Until You Make It</span>
    </div>
  </v-img>
  <v-timeline side="end">
    <v-timeline-item v-for="({ title, excerpt, date, url }, i) in summary" size="small" dot-color="primary">
      <template v-slot:opposite v-if="!display.mobile.value">
        <div class="pt-1 headline font-weight-bold" v-text="useDateFormat(date, 'YYYY-MM-DD')"></div>
      </template>
      <v-card variant="text" hover>
        <div class="text-h6 font-weight-bold v-card-text">{{ title }}</div>
        <v-card-subtitle v-if="display.mobile.value">{{ useDateFormat(date, 'YYYY-MM-DD') }}</v-card-subtitle>
        <v-card-text>{{ excerpt }}</v-card-text>
        <v-card-actions>
          <v-btn text @click="router.go(url)" color="primary">阅读全文</v-btn>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import { useRouter } from 'vitepress'
import { useDisplay } from 'vuetify'
import { useDateFormat } from '@vueuse/core'
import { data as summary } from '../composable/post.data'

const router = useRouter()
const display = useDisplay()
</script>