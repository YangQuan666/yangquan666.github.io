<template>
  <ul v-for="head in data">

    <li>
      <q-item
          dense
          clickable
          @click="link = 'inbox'"
          :href="head.link"
          style="border-radius: 32px 0 0 32px"
      >
        <q-item-section>{{ head.title }}</q-item-section>
      </q-item>
    </li>
    <template v-if="head.children && head.children.length">
      <Toc :data="head.children"></Toc>
    </template>

  </ul>
</template>

<script lang="ts" setup>
import {defineProps, ref} from "vue";

defineProps({data: Array})

const first = ref(false)
</script>