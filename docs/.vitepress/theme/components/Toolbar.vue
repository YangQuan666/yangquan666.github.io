<template>
  <div class="gt-sm">
    <q-btn-dropdown stretch flat label="Theme" :model-value="value">
      <q-list>
        <q-item
            v-for="theme in themes"
            :key="theme"
            @click="theme.trigger"
            clickable
            v-close-popup>
          <q-item-section avatar>
            <q-avatar :icon="theme.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ theme.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div class="lt-sm">
    <q-btn flat round icon="search"/>
    <q-btn flat round icon="more_vert"/>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useQuasar} from 'quasar';

const $q = useQuasar()

const themes = [
  {
    'name': 'Auto',
    'icon': 'brightness_medium',
    'trigger': () => {
      $q.dark.set('auto')
    }
  }, {
    'name': 'Light',
    'icon': 'light_mode',
    'trigger': () => {
      $q.dark.set(false)
    }
  }, {
    'name': 'Dark',
    'icon': 'dark_mode',
    'trigger': () => {
      $q.dark.set(true)
    }
  }
]
const language = [
  {
    'name': 'zh_CN',
  }, {
    'name': 'en_US',
  }
]
const value = ref('')
</script>