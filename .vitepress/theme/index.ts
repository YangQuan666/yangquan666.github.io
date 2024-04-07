// https://vitepress.dev/guide/custom-theme
// @ts-ignore
import Layout from './Layout.vue'
import type {Theme} from 'vitepress'
import './style.css'
import {initQuasar} from './composables/quasar'

export default {
    Layout,
    enhanceApp({app, router, siteData}) {
        // ...
        initQuasar(app)
    }
} satisfies Theme

