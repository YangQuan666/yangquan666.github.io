<template>
  <div class="text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ msgs[Math.floor(Math.random() * msgs.length)] }}
      </div>

      <q-btn
          @click="router.go(site.base)"
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          label="Go Home"
          no-caps
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useData, useRouter} from 'vitepress';

const router = useRouter()
const {site} = useData()

const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]
</script>
