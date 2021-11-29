import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import store from './store'
import mitt from 'mitt'
import router from '@/router/index'

import './assets/css/tailwind.css'

import {
  VTooltip,
  Dropdown,
  Tooltip,
  Menu
} from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'

import 'remixicon/fonts/remixicon.css'

const i18n = createI18n({
  locale: 'fr'
})

const emitter = mitt()

const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)

app.directive('tooltip', VTooltip)
app.component('VDropdown', Dropdown)
app.component('VTooltip', Tooltip)
app.component('VMenu', Menu)

app.config.globalProperties.emitter = emitter
app.mount('#app')
