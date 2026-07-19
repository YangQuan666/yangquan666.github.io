<template>
  <v-autocomplete
      v-model="val"
      :items="results"
      @update:search="search"
      :custom-filter="()=> true"
      :prepend-inner-icon="mdiMagnify"
      density="comfortable"
      menu-icon=""
      placeholder="键入 [/] 搜索"
      ref="focused"
      variant="solo"
      auto-select-first
      item-props
      hide-no-data
      hide-details
      loading
      clearable
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
          label
          color="primary"
          v-bind="props"
          :text="item.raw.name"
      ></v-chip>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item
          v-bind="props"
          title=""
      >
        <v-breadcrumbs :items="item.raw.titles">
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
import {useData, useRouter} from 'vitepress'
import {onKeyStroke} from '@vueuse/core'
import {mdiMagnify}  from '@mdi/js'

const router = useRouter()
const searchIndexData = shallowRef(localSearchIndex)
const searching = ref(false)
const vitePressData = useData()
const {localeIndex, theme} = vitePressData

const val = ref()

watch(val, (val) => {
  if (val) {
    router.go(val.id)
  }
})
let searchIndexPromise: Promise<MiniSearch> | undefined
let searchRequestId = 0

const getSearchIndex = () => {
  if (!searchIndexPromise) {
    searchIndexPromise = (async () => {
      const loadIndex = searchIndexData.value[localeIndex.value]
      if (!loadIndex) throw new Error('搜索索引不存在')

      const indexData = (await loadIndex()).default
      return markRaw(MiniSearch.loadJSON(indexData, {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: {title: 4, text: 2, titles: 1},
          ...theme.value.search.options?.miniSearch?.searchOptions
        },
        ...theme.value.search.options?.miniSearch?.options
      }))
    })()
  }
  return searchIndexPromise
}

const results = shallowRef([])

const search = async (str: string) => {
  const keyword = str?.trim()
  const requestId = ++searchRequestId

  if (!keyword) {
    results.value = []
    searching.value = false
    return
  }

  searching.value = true
  try {
    const searchIndex = await getSearchIndex()
    if (requestId !== searchRequestId) return

    const resp = searchIndex.search(keyword)
    results.value = resp.slice(0, 16)
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      id: item.id,
      score: item.score,
      name: item.title,
      titles: [...item.titles, item.title],
    }))
  } catch (error) {
    console.error(error)
    if (requestId === searchRequestId) results.value = []
  } finally {
    if (requestId === searchRequestId) searching.value = false
  }
}

const focused = ref()
onKeyStroke('/', (e) => {
  e.preventDefault()
  focused.value?.focus()
})
onKeyStroke('Escape', () => {
  focused.value?.blur()
})
</script>
