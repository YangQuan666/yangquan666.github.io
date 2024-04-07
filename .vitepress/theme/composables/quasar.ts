import {App} from 'vue'
import {Quasar} from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/dist/quasar.css'

export function initQuasar(app: App) {
    app.use(Quasar, {
        config: {
            dark: 'auto'
        }
    }, {
        req: {
            headers: {}
        }
    });
}
