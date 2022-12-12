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

function getDateDiff(timestamp) {
  const now = new Date()
  let diff = date.getDateDiff(now, timestamp, 'days')
  if (diff < 7) {
    return '0$day'
  }
  // 一周前
  if (diff >= 7 && diff < 30) {
    return '1$week'
  }
  diff = date.getDateDiff(now, timestamp, 'months')
  // 一个月前
  if (diff < 6) {
    return '2$month'
  }
  // 半年前
  if (diff >= 6 && diff < 12) {
    return '3$half'
  }
  // 每年划分一次
  return '4$' + date.formatDate(timestamp, "YYYY")

}

function groupByTime(summary) {
  const reduce = summary
      .reduce((group, value) => {
        const type = getDateDiff(value.time)
        group[type] = group[type] || []
        group[type].push(value)
        return group
      }, {});

  const newArray = []
  Object.keys(reduce).sort().forEach(key => {
    newArray.push({type: key.substring(2), excerpt: '自定义标题'})
    newArray.push(reduce[key])
  })
  return newArray.flat(1)
}
</script>