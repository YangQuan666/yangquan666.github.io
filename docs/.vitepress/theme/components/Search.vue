<template>
  <q-select
      v-model="text"
      :options="options"
      @filter="filter"
      standout
      use-input
      dense
      hide-dropdown-icon
      style="width: 50%"
  >

    <template v-slot:prepend>
      <q-icon name="search"/>
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
import {ref} from 'vue';

const stringOptions = [
  'quasarframework/quasar',
  'quasarframework/quasar-awesome'
]

const text = ref('')
const options = ref(null)

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

</script>
