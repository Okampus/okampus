import { createApp } from 'vue'
import App from './App.vue'
import './assets/sass/main.scss'
import router from '@/router/index'
import {
  faSearch,
  faFolderOpen,
  faBell,
  faEnvelope,
  faBars,
  faTimesCircle,
  faSortDown,
  faCaretDown,
  faCaretUp,
  faPlus,
  faReply,
  faFlag,
  faCommentAlt,
  faAt
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faSearch, faSortDown, faFolderOpen, faBell, faEnvelope, faBars, faTimesCircle, faCaretUp, faCaretDown, faPlus, faReply, faFlag, faAt, faCommentAlt)
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
