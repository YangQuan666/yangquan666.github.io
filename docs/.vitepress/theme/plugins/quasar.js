import {Quasar, Dark, Notify} from "quasar";

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import 'animate.css';
// Import Quasar css
import 'quasar/dist/quasar.css'


export function initQuasar(app) {
    app.use(Quasar, {
        config: {
            brand: {
                primary: '#1976d2',
                secondary: '#26A69A',
                accent: '#9C27B0',

                dark: '#1d1d1d',

                positive: '#21BA45',
                negative: '#C10015',
                info: '#31CCEC',
                warning: '#F2C037'
            },
            dark: 'auto'
        },
        plugins: {
            Dark,
            Notify,
        },
    }, {
        req: {
            headers: {}
        }
    });
}