<template>
  <v-img
      class="align-center justify-center"
      height="500px"
      src="/map.svg"
      cover
  >
    <div class="text-center text-h3 font-weight-bold bg-secondary">When in doubt, use brute force.</div>
  </v-img>
  <v-timeline align="start" side="end">
    <v-timeline-item size="small"
                     v-for="({title, excerpt, date, url}, i) in summary"
                     :key="i"
                     dot-color="info">
      <template v-slot:opposite>
        <div
            class="pt-1 headline font-weight-bold"
            v-text="dateInstance.format(date,'keyboardDate')"
        ></div>
      </template>
      <div class="d-flex">
        <div>
          <div class="text-h5 font-weight-bold">{{ title }}</div>
          <div class="text-caption">{{ excerpt }}</div>
          <v-btn
              color="info"
              variant="plain"
              @click="router.go(url)"
          >
            阅读全文
          </v-btn>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>

</template>

<script setup>
import {useRouter} from 'vitepress'
import {useDate} from 'vuetify'
import {data as summary} from '../composable/post.data'

const router = useRouter()
const dateInstance = useDate()
</script>