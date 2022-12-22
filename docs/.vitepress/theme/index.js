import Layout from './Layout.vue'
import Error404 from './components/Error404.vue'
import 'github-markdown-css'
import './plugins/custom.css'

import {initQuasar} from './plugins/quasar'

export default {
    Layout,
    NotFound: Error404,
    enhanceApp({app, router, siteData}) {
        // app is the Vue 3 app instance from `createApp()`. router is VitePress'
        // custom router. `siteData`` is a `ref`` of current site-level metadata.
        initQuasar(app)
    }
}