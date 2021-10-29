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
    <q-btn flat round icon="more_vert">
      <q-menu
          transition-show="jump-down"
          transition-hide="jump-up"
      >
        <q-list>
          <q-item
              v-for="menu in menus"
              :key="menu"
              clickable
              v-close-popup>
            <q-item-section>{{ menu.label }}</q-item-section>
            <q-item-section side v-if="menu.children">
              <q-icon name="keyboard_arrow_right"/>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section>Preferences</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right"/>
            </q-item-section>

            <q-menu anchor="top end" self="top start">
              <q-list>
                <q-item
                    v-for="n in 3"
                    :key="n"
                    dense
                    clickable
                >
                  <q-item-section>Submenu Label</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>

          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import {useQuasar} from 'quasar';
import {ref} from "vue";

const $q = useQuasar()
const menus = [
  {
    label: 'Theme',
    children: []
  }, {
    label: 'Language',
    children: []
  },
]

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