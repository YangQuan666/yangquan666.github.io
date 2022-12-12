<template>
<!-- todo 移动页面只显示搜索icon，点击后展开并覆盖掉左边的logo -->
  <q-select
      v-model="text"
      :options="options"
      @filter="filter"
      standout
      use-input
      dense
      dark
      hide-dropdown-icon
      hide-selected
      behavior="menu"
      :style="{ width: ($q.screen.gt.sm ? '50%' : '75%' ) }"
  >

    <template v-slot:prepend>
      <q-icon name="search"/>
    </template>

    <template v-slot:append>
      cmd+k
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section>
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
          <q-item-label v-html="scope.opt.label" @click="cli(scope.opt)"/>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import {ref} from 'vue';

const stringOptions = [
  'quasarframework/quasar',
  'quasarframework/quasar-awesome'
]

const text = ref('')
const options = ref([])

function filter(val, update) {

  if (options.value === null) {
    // load data
    setTimeout(() => {
      update(() => {
        options.value = stringOptions
            .filter(op => op !== '' && op.toLowerCase().includes(val.toLowerCase()))
            .map(op => ({label: op}))
      })
    }, 1000)
    return
  }

  update(() => {
    options.value = stringOptions
        .filter(op => op.toLowerCase().includes(val.toLowerCase()))
        .map(op => ({label: op}))
    if (val !== '') {
      options.value.unshift({
            label: val,
          })
    }
  })
}

function   cli(k) {
  console.log(k)
}

</script>
