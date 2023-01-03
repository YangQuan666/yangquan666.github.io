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
          active-class="q-bar"
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
import {isActivate, uniqueItemKey} from '../composables/outline'

defineProps({headers: Array, path: {type: String, default: ''}});

const onItemClick = (path, link) => {
  uniqueItemKey.value = path + link
}

</script>