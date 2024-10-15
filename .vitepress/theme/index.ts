// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from "./Layout.vue"
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({ components, directives})

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(vuetify)
  },
} satisfies Theme

