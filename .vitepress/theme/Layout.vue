<template>
  <v-app :theme="theme">
    <v-app-bar class="px-3" color="primary" prominent>
      <template v-slot:prepend>
        <v-app-bar-nav-icon aria-label="切换导航菜单" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-btn icon variant="plain" aria-label="返回主页" @click="router.go(site.base)">
        <v-avatar>
          <v-img :src="themeConfig.logo" :alt="site.title"></v-img>
        </v-avatar>
      </v-btn>
      <v-app-bar-title v-if="display.mdAndUp.value">{{ site.title }}</v-app-bar-title>
      <Search />
      <v-spacer v-if="display.mdAndUp.value" />
      <v-progress-linear
        absolute
        color="secondary"
        :active="loading"
        :indeterminate="loading"
      ></v-progress-linear>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="bg-primary">
      <template v-slot:prepend>
        <v-card color="transparent" elevation="0" class="text-center">
          <v-avatar color="brown" size="200" class="mt-4">
            <v-img :alt="themeConfig.author" src="/avatar.webp"></v-img>
          </v-avatar>
          <v-card-title>{{ themeConfig.author }}</v-card-title>
          <v-card-subtitle>{{ themeConfig.signature }}</v-card-subtitle>
          <v-card-actions class="justify-center">
            <v-btn
              v-for="item in themeConfig.socialLinks"
              :key="item.link"
              variant="text"
              :icon="item.icon"
              :href="item.link"
              :aria-label="item.ariaLabel"
              :title="item.ariaLabel"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item
          :prepend-icon="mdiViewDashboard"
          title="主页"
          value="home"
          :href="site.base"
          :active="route.path === site.base"
        ></v-list-item>
        <v-list-group
          v-for="nav in themeConfig.nav"
          :key="nav.title"
          :value="nav.title"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="nav.icon" :title="nav.title"></v-list-item>
          </template>
          <v-list-item
            v-for="{ title, icon, link } in nav.items"
            :key="link"
            :append-icon="icon"
            :title="title"
            :value="title"
            :active="route.path === link"
            @click="router.go(link)"
          ></v-list-item>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
        <v-row justify="center" class="pa-2">
          <v-switch
            :model-value="theme === 'dark'"
            label="切换主题"
            color="dark"
            hide-details
            @update:model-value="toggleTheme"
          ></v-switch>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-main>
      <Timeline v-if="page.frontmatter.layout === 'home'" />
      <Post v-else-if="page.frontmatter.layout === 'post'" />
      <Content v-else />
    </v-main>

    <v-footer name="footer" class="bg-indigo-lighten-1 d-flex flex-column">
      <div class="pt-0">Released under the GPLv3 License.
        Copyright © 2019-present <strong>{{ themeConfig.author }}</strong></div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed, ref, watchPostEffect } from 'vue'
import { useData, useRouter, useRoute } from 'vitepress'
import { mdiViewDashboard } from '@mdi/js'
import { useDisplay } from 'vuetify'
import Post from './component/Post.vue'
import Timeline from './component/Timeline.vue'
import Search from './component/Search.vue'

const drawer = ref()
const { site, page, isDark } = useData()
const themeConfig = computed(() => site.value.themeConfig)
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const display = useDisplay()
const theme = ref('light')

watchPostEffect(() => {
  theme.value = isDark.value ? 'dark' : 'light'
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

router.onBeforeRouteChange = () => {
  loading.value = true
}
router.onAfterRouteChanged = () => {
  loading.value = false
  if (display.mdAndDown.value) {
    drawer.value = false
  }
}
</script>
