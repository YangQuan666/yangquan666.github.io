// https://vitepress.dev/guide/custom-theme
// @ts-ignore
import Layout from './Layout.vue'
import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import {initQuasar} from './composable/quasar'
import InstantSearch from 'vue-instantsearch/vue3/es'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({app, router, siteData}) {
        // ...
        initQuasar(app)
        app.use(InstantSearch)
    }
} satisfies Theme

