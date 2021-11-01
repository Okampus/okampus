import { createApp } from 'vue'

import App from './App.vue'
import store from './store'
import mitt from 'mitt'
import router from '@/router/index'
import './assets/css/tailwind.css'
import './validators.js'

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

import 'remixicon/fonts/remixicon.css'
const emitter = mitt()

const app = createApp(App)
  .use(store)
  .use(router)
  .use(VueTippy)

app.config.globalProperties.emitter = emitter
app.mount('#app')
