<template>
  <q-drawer
      v-model="outlineDraw"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      side="right"
      show-if-above
      mini-to-overlay
      bordered
  >
    <q-list padding>
      <q-item>
        <q-item-section avatar>
          <q-icon name="toc"/>
        </q-item-section>

        <q-item-section class="text-h5">
          目录
        </q-item-section>
      </q-item>
      <OutlineItem :headers="headers"/>
    </q-list>
  </q-drawer>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import OutlineItem from './OutlineItem.vue';
import {outlineDraw} from '../composables/store'

defineProps({headers: Array});

const miniState = ref(true)

</script>