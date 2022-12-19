<template>
  <q-toolbar>
    <q-btn flat round icon="menu" @click="$emit('updateDrawer')"/>

    <q-toolbar-title
        shrink
        class="row items-center no-wrap"
    >
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="logo">
      </q-avatar>
      <span class="q-ml-sm">quan's blog</span>
    </q-toolbar-title>
    <q-space/>

    <q-input
        dark
        standout bottom-slots
        v-model="keyword"
        placeholder="Search"
        dense hide-bottom-space
        class="search-field"
        :class="{ 'search-closed': onDynamic}"
        @blur="searchOpen = false"
        @focus="searchOpen = true"
        clearable clear-icon="close"
    >
      <template #prepend>
        <q-icon name="search" class="cursor-pointer"></q-icon>
      </template>
    </q-input>
    <q-space v-if="$q.screen.gt.sm"/>
  </q-toolbar>
</template>

<script lang="ts" setup>
import {useQuasar} from 'quasar';
import {computed, ref} from "vue";

defineProps({drawer: Boolean})

const $q = useQuasar()
const keyword = ref('')

const smScreen = computed(() => $q.screen.lt.sm)
const searchOpen = ref(false)

const onDynamic = computed(() => {
  return smScreen.value && !(smScreen.value && searchOpen.value)
})
</script>