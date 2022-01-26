import { createStore } from 'vuex'
import { auth } from './auth.module'
import { files } from './files.module'
import { threads } from './threads.module'
import { userConfig } from './userConfig.module'
import { users } from './users.module'

const store = createStore({
    state: {},
    modules: {
        auth,
        files,
        userConfig,
        users,
        threads,
    },
})

export default store
