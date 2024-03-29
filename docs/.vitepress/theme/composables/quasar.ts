import {Cookies, Dark, Quasar} from 'quasar';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// import 'animate.css';
// Import Quasar css
import 'quasar/dist/quasar.css'
import {App} from 'vue';

export function initQuasar(app: App) {
    app.use(Quasar, {
        config: {
            brand: {
                primary: '#1976D2',
                secondary: '#26A69A',
                accent: '#9C27B0',

                dark: '#1D1D1D',

                positive: '#21BA45',
                negative: '#C10015',
                info: '#31CCEC',
                warning: '#F2C037'
            },
            dark: 'auto'
        },
        plugins: {
            Dark,
            Cookies
        }
    }, {
        req: {
            headers: {}
        }
    });
}