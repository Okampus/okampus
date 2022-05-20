import App from '@/App.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import InstantSearch from 'vue-instantsearch/vue3/es'
import Particles from 'particles.vue3'

import { emitter } from '@/shared/modules/emitter'
import { i18n } from '@/shared/modules/i18n'

import axios from '@/shared/config/axios.config'
import router from '@/router/index'
import store from '@/old-store'

import '@/assets/css/tailwind.css'

const app = createApp(App)

app.config.globalProperties.$axios = axios

app.config.errorHandler = (error, vm, info) => {
    console.log('Vue Error', error, vm, info)
    emitter.emit('show-toast', {
        message: `[BUG À SIGNALER] ${error}`,
        type: 'bug',
        duration: -1,
    })
    console.error(error, info)
}

// TODO: remove injection of modules in favor of composition API
app.use(store).use(createPinia()).use(router).use(i18n).use(InstantSearch).use(Particles)

app.mount('#app')
