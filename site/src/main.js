import App from '@/App.vue'
import FontAwesomeIcon from '@/fontawesome-icons'
import router from '@/router/index'
import store from '@/store'
import mitt from 'mitt'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import InstantSearch from 'vue-instantsearch/vue3/es'
import './assets/css/tailwind.css'
import axios from './shared/config/axios.config'
import VueCookies from 'vue3-cookies'

const emitter = mitt()

const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .use(createI18n({ locale: 'fr' }))
    .use(InstantSearch)
    .use(VueCookies)

app.config.globalProperties.$emitter = emitter
app.config.globalProperties.$axios = axios

app.mount('#app')
