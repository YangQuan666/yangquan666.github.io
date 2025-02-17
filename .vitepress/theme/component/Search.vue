<template>
  <v-autocomplete
      :items="results"
      @update:search="search"
      append-inner-icon="mdi-magnify"
      density="comfortable"
      menu-icon=""
      placeholder="搜索"
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
    <template v-slot:chip="{ props, item }">
      <v-chip
          v-bind="props"
          :prepend-avatar="item.raw.avatar"
          :text="item.raw.name"
      ></v-chip>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item
          v-bind="props"
          title=""
          @click="router.go(item.raw.id)"
      >
        <v-breadcrumbs :items="item.raw.terms" >
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import {markRaw, ref, shallowRef, watch} from 'vue'
import MiniSearch from 'minisearch'
import localSearchIndex from '@localSearchIndex'
import type {SearchResult} from "minisearch"
import {useData, useRouter} from 'vitepress'
import type {Ref} from 'vue'
import {computedAsync} from '@vueuse/core'

const router = useRouter()
const searchIndexData = shallowRef(localSearchIndex)
const searching = ref(false)
const vitePressData = useData()
const {localeIndex, theme} = vitePressData

const searchIndex = computedAsync(async () =>
    markRaw(
        MiniSearch.loadJSON<Result>(
            (await searchIndexData.value[localeIndex.value]?.())?.default,
            {
              fields: ['title', 'titles', 'text'],
              storeFields: ['title', 'titles'],
              searchOptions: {
                fuzzy: 0.2,
                prefix: true,
                boost: {title: 4, text: 2, titles: 1},
                ...theme.value.search.options?.miniSearch?.searchOptions
              },
              ...theme.value.search.options?.miniSearch?.options
            }
        )
    )
)

const results: Ref<SearchResult[]> = shallowRef([])

const search = function (value) {
  searching.value = true
  computedAsync(async () => {
    results.value = searchIndex.value.search(value).slice(0, 16)
    searching.value = false
  })
}

watch(results, (value, oldValue, onCleanup)=>{
  console.log('watch',value)
})
</script>

<style scoped>

</style>