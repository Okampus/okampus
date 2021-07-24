import { createApp } from 'vue'
import App from './App.vue'
import './assets/sass/main.scss'

import {
  faSearch,
  faFolderOpen,
  faBell,
  faEnvelope,
  faBars,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faSearch, faFolderOpen, faBell, faEnvelope, faBars, faTimesCircle)
createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
