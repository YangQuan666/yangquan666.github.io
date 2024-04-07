<template>
  <ul v-for="head in headers">

    <li>
      <q-item
          dense
          clickable
          :href="head.link"
          :id="'toc--' + path + head.link"
          :key="path + head.link"
          :active="isActivate(path, head.link)"
          @click="onItemClick(path, head.link)"
          style="border-radius: 8px 0 0 8px"
      >
        <q-item-section>{{ head.title }}</q-item-section>
      </q-item>
    </li>

    <template v-if="head.children && head.children.length">
      <OutlineItem :headers="head.children" :path="path + head.link"></OutlineItem>
    </template>

  </ul>
</template>

<script lang="ts" setup>
import {isActivate, uniqueItemKey} from '../composable/outline'
import {outlineDrawer} from '../composable/store'
import {useQuasar} from 'quasar'

defineProps({headers: Array, path: {type: String, default: ''}});

const $q = useQuasar()
const onItemClick = (path: string, link: string) => {
  uniqueItemKey.value = path + link
  if ($q.screen.lt.md) {
    outlineDrawer.value = false
  }
}

</script>
