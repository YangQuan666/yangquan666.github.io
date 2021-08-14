// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'


// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components/index.mjs'
import * as directives from 'vuetify/lib/directives/index.mjs'

function initTheme() {
  const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const theme = darkTheme.matches ? 'dark' : 'light';
  return theme;
}

export default createVuetify({
  components,
  directives,
  defaults: {
  },
  theme: {
    defaultTheme: initTheme(),
  }
})
