<template>
  <transition
      appear
      enter-active-class="animated animate__fadeIn"
      leave-active-class="animated animate__fadeOut"
  >
    <div class="row">
      <div class="col-10 offset-1 col-sm-8 offset-sm-2">
        <q-timeline :layout="layout" color="secondary">
          <q-timeline-entry heading>时间轴</q-timeline-entry>
          <q-timeline-entry
              v-for="summary in summaries"
              :title="summary.title"
              :subtitle="summary.time"
              side="left"
          >
            <div class="text-caption">{{ summary.excerpt }}</div>
            <q-btn
                flat
                color="info"
                @click="router.go(summary.link)"
            >
              阅读全文
            </q-btn>
          </q-timeline-entry>
        </q-timeline>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vitepress'
import {useQuasar} from 'quasar'
import summaries from '../../../post/summary.json'

const router = useRouter()
const $q = useQuasar()

const layout = computed(() => $q.screen.lt.sm ? 'dense' : 'comfortable')
</script>