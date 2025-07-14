// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Error404 from './component/Error404.vue'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})


export default {
  extends: DefaultTheme,
  Layout,
  NotFound: Error404,
  enhanceApp({ app }) {
    app.use(vuetify)
  },
} satisfies Theme

