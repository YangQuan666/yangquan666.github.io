// https://vitepress.dev/guide/custom-theme
// @ts-ignore
import Layout from './Layout.vue'
import type {Theme} from 'vitepress'
import './style.css'
import {initQuasar} from './composable/quasar'
import InstantSearch from 'vue-instantsearch/vue3/es'

export default {
    Layout,
    enhanceApp({app, router, siteData}) {
        // ...
        initQuasar(app)
        app.use(InstantSearch)
    }
} satisfies Theme

