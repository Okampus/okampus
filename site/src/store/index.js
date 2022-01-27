import { createStore } from 'vuex'
import { auth } from './auth.module'
import { clubs } from './clubs.module'
import { files } from './files.module'
import { threads } from './threads.module'
import { userConfig } from './userConfig.module'
import { users } from './users.module'
import { reports } from './reports.modules'

const store = createStore({
    state: {},
    modules: {
        auth,
        clubs,
        files,
        userConfig,
        users,
        threads,
        reports,
    },
})

export default store
