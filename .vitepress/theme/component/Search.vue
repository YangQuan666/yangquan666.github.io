<template>
  <v-autocomplete
      :items="results"
      @update:search="search"
      :custom-filter="filter"
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
          :text="item.raw.name"
      ></v-chip>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item
          v-bind="props"
          :value="item.raw.id"
          title=""
          @click="router.go(item.raw.id)"
      >
      <!-- {{ item.raw }} -->
        <v-breadcrumbs :items="item.raw.titles" >
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

const search = function (str) {
  if (str === "") {
    return
  }
  searching.value = true
  computedAsync(async () => {
    const resp = await searchIndex.value.search(str)
    results.value = resp.slice(0, 16)
    searching.value = false
  })
}

const filter = function (value, queryText, item) {
  return true
}
</script>

<style scoped>

</style>