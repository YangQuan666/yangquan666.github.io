<template>
  <v-autocomplete
      :items="items"
      @update:search="search"
      append-inner-icon="mdi-magnify"
      density="comfortable"
      menu-icon=""
      placeholder="Search Google or type a URL"
      style="min-width: 350px;"
      variant="solo"
      auto-select-first
      item-props
      hide-details
      loading
  >
    <template v-slot:loader>
      <v-progress-linear
          :active="searching"
          color="success"
          height="7"
          indeterminate
      ></v-progress-linear>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref } from 'vue'

// TODO 从cookies中加载历史搜索信息，放到items中
const items = ref([{
  prependIcon: 'mdi-clock-outline',
  title: 'recipe with chicken',
}])

const searching = ref(false)

const search = function (value) {
  console.log('searching....' + value)
  searching.value = true
  setTimeout(() => {
    // country.value = ['beijing', value]
    searching.value = false
  }, 1000); // 延迟 1 秒

}
</script>

<style scoped>

</style>