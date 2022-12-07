<template>
  <div class="q-pa-lg">
    <q-timeline :layout="layout" color="secondary">
      <q-timeline-entry heading>最新文章</q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          side="left"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 21, 1986"
          side="right"
          icon="delete"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>November, 2017</q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          side="left"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          side="right"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          side="left"
          color="orange"
          icon="done_all"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          side="right"
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </q-timeline-entry>

      <q-timeline-entry
          v-for="s in summary"
          :title="s.title"
          :subtitle="s.time"
          side="left"
      >
        <div>{{ s.excerpt }}</div>
        <q-btn flat :href="s.link">阅读全文</q-btn>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vitepress'
import {date, useQuasar} from 'quasar'
import summary from '../../../post/summary.json'

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