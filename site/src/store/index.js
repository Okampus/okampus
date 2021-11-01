import { createStore } from 'vuex'
import { auth } from './auth.module'
import { posts } from './posts.module'
import { files } from './files.module'
import { userConfig } from './userConfig.module'

const store = createStore({
  state: {
  },
  modules: {
    auth,
    posts,
    files,
    userConfig
  }
})

export default store
