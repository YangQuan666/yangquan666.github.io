<template>
  <div class="q-pa-lg">
    <q-timeline :layout="layout" color="secondary">
      <q-timeline-entry heading>Timeline</q-timeline-entry>
      <q-timeline-entry
          v-for="summary in summaries"
          :title="summary.title"
          :subtitle="summary.time"
          side="left"
      >
        <div class="text-caption">{{ summary.excerpt }}</div>
        <q-btn
            flat
            color="primary"
            @click="router.go(summary.link)"
        >
          阅读全文
        </q-btn>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vitepress'
import {date, useQuasar} from 'quasar'
import summaries from '../../../post/summary.json'

const router = useRouter()
const $q = useQuasar()

const layout = computed(() => $q.screen.lt.sm ? 'dense' : 'comfortable')
</script>