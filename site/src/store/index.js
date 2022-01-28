import { createStore } from 'vuex'

import { auth } from './auth.module'
import { files } from './files.module'
import { profiles } from './profiles.module'
import { reports } from './reports.modules'
import { threads } from './threads.module'
import { user } from './user.module'

const store = createStore({
    state: {},
    modules: {
        auth,
        files,
        profiles,
        reports,
        threads,
        user,
    },
})

export default store
