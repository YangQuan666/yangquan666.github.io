<template>
  <q-img src="map.svg" height="400px" alt="background">
    <h3 class="absolute-full flex flex-center">
      When in doubt, use brute force.
    </h3>
  </q-img>
  <div class="row animate__animated animate__fadeIn">
    <div class="col-10 offset-1 col-sm-8 offset-sm-2">
      <q-timeline layout="dense" color="secondary">
        <q-timeline-entry heading>时间轴（{{posts.length}}）</q-timeline-entry>
        <q-timeline-entry
            v-for="post in posts"
            :title="post.title"
            :subtitle="post.time"
            side="left"
        >
          <div class="text-caption">{{ post.excerpt }}</div>
          <q-btn
              flat
              color="info"
              @click="router.go(post.url)"
          >
            阅读全文
          </q-btn>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vitepress'
import {useQuasar} from 'quasar'

const router = useRouter()
const $q = useQuasar()

import { data as posts } from '../composable/post.data'

console.log(posts)
</script>
