<template>
  <div class="gt-sm">
    <q-btn-dropdown stretch flat icon="invert_colors">
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
    <q-btn-dropdown stretch flat icon="translate">
      <q-list>
        <q-item
            v-for="theme in language"
            :key="theme"
            @click="theme.trigger"
            clickable
            v-close-popup>
          <q-item-section>
            <q-item-label>{{ theme.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div class="lt-sm">
    <q-btn flat round icon="more_vert"/>
  </div>
</template>

<script lang="ts" setup>
import {useQuasar} from 'quasar';

const $q = useQuasar()

const themes = [
  {
    'name': 'Auto',
    'icon': 'brightness_auto',
    'trigger': () => $q.dark.set('auto')

  }, {
    'name': 'Light',
    'icon': 'light_mode',
    'trigger': () => $q.dark.set(false)

  }, {
    'name': 'Dark',
    'icon': 'dark_mode',
    'trigger': () => $q.dark.set(true)

  }
]
const language = [
  {
    'name': '简体中文',
    'trigger': () => alert('简体中文')
  }, {
    'name': 'English',
    'trigger': () => alert('English')
  }
]
</script>