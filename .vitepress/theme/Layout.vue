<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" color="primary" prominent>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-avatar :image="themeConfig.logo"></v-avatar>
        <v-app-bar-title>{{ site.title }}</v-app-bar-title>
        <v-progress-linear indeterminate absolute
                           color="secondary"
                           :active="loading"
                           :indeterminate="loading"
        ></v-progress-linear>
        <template v-slot:append>
          <v-btn icon="mdi-magnify"></v-btn>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>
      <v-navigation-drawer
          class="bg-primary"
          v-model="drawer"
      >
        <template v-slot:prepend>
          <div class="mx-auto text-center">
            <v-avatar color="brown" size="200">
              <v-img
                  :alt="themeConfig.author"
                  src="/avatar.webp"
              ></v-img>
            </v-avatar>
            <h3>{{ themeConfig.author }}</h3>
            <p class="text-caption mt-1">{{ themeConfig.signature }}</p>
            <v-btn variant="text" :icon="item.icon" :href="item.link" v-for="item in themeConfig.socialLinks"></v-btn>
          </div>
        </template>
        <v-divider/>
        <v-list nav>
          <v-list-item prepend-icon="mdi-view-dashboard"
                       title="主页"
                       value="home"
                       href="/"
                       @click="changeTheme"
                       :active="route.path===site.base">
          </v-list-item>
          <v-list-group :value="nav.title" v-for="nav in themeConfig.nav">
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  :prepend-icon="nav.icon"
                  :title="nav.title"
              ></v-list-item>
            </template>
            <v-list-item
                v-for="({title, icon, link}, i) in nav.items"
                :key="i"
                :append-icon="icon"
                :title="title"
                :value="title"
                :active="route.path===link"
                @click="router.go(link)"
            ></v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-main
          class="align-center justify-center"
      >
        <v-container>
          <Timeline v-if="page.frontmatter.layout === 'home'"/>
          <Post v-else-if="page.frontmatter.layout === 'post'"/>
          <Content v-else/>
        </v-container>
      </v-main>

      <v-footer
          name="footer"
          class="bg-indigo-lighten-1 text-center d-flex flex-column"
      >
        <div>
          <v-btn
              v-for="icon in icons"
              :key="icon"
              :icon="icon"
              class="mx-4"
              variant="text"
          ></v-btn>
        </div>

        <div class="pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent
          ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet
          dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum
          ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci
          varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </div>

        <v-divider></v-divider>

        <div>
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
<script setup>
import {ref} from 'vue'
import {useData, useRouter, useRoute} from 'vitepress'
import {useDisplay} from 'vuetify'
import Post from './component/Post.vue'
import Timeline from "./component/Timeline.vue"

const drawer = ref()
const {site, page} = useData()
const {themeConfig} = site.value
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const display = useDisplay()

router.onBeforeRouteChange = ()=>{
  loading.value = true
}
router.onAfterRouteChanged = ()=>{
  loading.value = false
  if (display.mdAndDown) {
    drawer.value = false
  }
}
///----///
const theme = ref('light')
function changeTheme () {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
</script>