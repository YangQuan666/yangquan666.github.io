import Layout from './Layout.vue'
import Error404 from './components/Error404.vue'

import 'github-markdown-css'
import './style/custom.css'

import InstantSearch from 'vue-instantsearch/vue3/es'
import {initQuasar} from './composables/quasar'
import {initRouter} from './composables/store'
import {EnhanceAppContext} from 'vitepress'

export default {
    Layout,
    NotFound: Error404,
    enhanceApp({app, router, siteData}: EnhanceAppContext) {
        // app is the Vue 3 app instance from `createApp()`. router is VitePress'
        // custom router. `siteData`` is a `ref`` of current site-level metadata.
        initQuasar(app)
        initRouter(router)
        app.use(InstantSearch)
    }
}