<template>
  <div class="gt-sm">
    <q-btn-dropdown
        v-for="menu in menus"
        :key="menu"
        :icon="menu.icon"
        stretch
        flat
    >
      <q-list>
        <q-item
            v-for="child in menu.children"
            :key="child"
            @click="child.trigger"
            clickable
            v-close-popup>
          <q-item-section avatar v-if="child.icon">
            <q-avatar :icon="child.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ child.name }}</q-item-label>
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
          >
            <q-item-section>{{ menu.label }}</q-item-section>
            <q-item-section side v-if="menu.children">
              <q-icon name="keyboard_arrow_right"/>
            </q-item-section>

            <!--二级菜单-->
            <q-menu anchor="top end" self="top start" v-close-popup>
              <q-list>
                <q-item
                    v-for="child in menu.children"
                    :key="child"
                    @click="child.trigger"
                    clickable
                    v-close-popup>
                  <q-item-section
                      v-if="child.icon"
                      avatar
                      side
                  >
                    <q-avatar :icon="child.icon"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ child.name }}</q-item-label>
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
    icon: 'invert_colors',
    children: [
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
  }, {
    label: 'Language',
    icon: 'translate',
    children: [
      {
        'name': '简体中文',
        'trigger': () => alert('简体中文')
      }, {
        'name': 'English',
        'trigger': () => alert('English')
      }
    ]
  },
]

</script>