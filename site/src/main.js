import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import store from './store'
import mitt from 'mitt'
import router from '@/router/index'

import './assets/css/tailwind.css'

import Popper from "vue3-popper"
import 'remixicon/fonts/remixicon.css'

import InstantSearch from 'vue-instantsearch/vue3/es';

const i18n = createI18n({
    locale: 'fr'
})

const emitter = mitt()

const app = createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .use(InstantSearch)

app.component('VPopper', Popper)
app.config.globalProperties.emitter = emitter
app.mount('#app')
