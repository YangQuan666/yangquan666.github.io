// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'


// Vuetify
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/lib/components/index.mjs'
import * as directives from 'vuetify/lib/directives/index.mjs'

import {mode, initTheme} from './theme';

initTheme()

export default createVuetify({
    components,
    directives,
    defaults: {},
    theme: {
        defaultTheme: mode.value,
    }
})
