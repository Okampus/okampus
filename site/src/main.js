import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from '@/App.vue'
import store from '@/store'
import mitt from 'mitt'
import router from '@/router/index'

import InstantSearch from 'vue-instantsearch/vue3/es'
import FontAwesomeIcon from '@/fontawesome-icons'

import './assets/css/tailwind.css'

const emitter = mitt()

const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .use(createI18n({ locale: 'fr' }))
    .use(InstantSearch)

app.config.globalProperties.emitter = emitter

app.mount('#app')
