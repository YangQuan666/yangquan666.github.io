<template>
  <q-select
      ref="search"
      :stack-label="false"
      v-model="text"
      :options="options"
      @filter="filter"
      palceholder="Search"
      class="gt-sm"
      standout
      use-input
      dense
      hide-dropdown-icon
      hide-selected
      style="width: 50%"
  >

    <template v-slot:prepend>
      <q-icon v-if="text === ''" name="search"/>
      <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''"/>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section side>
          <q-icon name="collections_bookmark"/>
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.label"/>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import {ref} from "vue";

const stringOptions = [
  'quasarframework/quasar',
  'quasarframework/quasar-awesome'
]

const text = ref('')
const options = ref(null)
// const filteredOptions = ref([])
const search = ref(null) // $refs.search

function filter(val, update) {
  // if (options.value === null) {
  //   // load data
  //   setTimeout(() => {
  //     options.value = stringOptions
  //     search.value.filter('')
  //   }, 1000)
  //   update()
  //   return
  // }
  // if (val === '') {
  //   update(() => {
  //     filteredOptions.value = options.value.map(op => ({label: op}))
  //   })
  //   return
  // }
  // update(() => {
  //   filteredOptions.value = [
  //     {
  //       label: val,
  //       type: 'In this repository'
  //     },
  //     {
  //       label: val,
  //       type: 'All GitHub'
  //     },
  //     ...options.value
  //         .filter(op => op.toLowerCase().includes(val.toLowerCase()))
  //         .map(op => ({label: op}))
  //   ]
  // })

  if (options.value === null) {
    // load data
    setTimeout(() => {
      update(() => {
        options.value = stringOptions
            .filter(op => op.toLowerCase().includes(val.toLowerCase()))
            .map(op => ({label: op}))
      })
    }, 200)
    return
  }
  // if (options.value !== null) {
  //   // already loaded
  //   update()
  //   return
  // }

  setTimeout(() => {
    update(() => {
      options.value = stringOptions
          .filter(op => op.toLowerCase().includes(val.toLowerCase()))
          .map(op => ({label: op}))
    })
  }, 500)
}

</script>
