import { createStore } from 'vuex'

import { files } from './files.module'
import { profiles } from './profiles.module'
import { user } from './user.module'

const store = createStore({
    state: {},
    modules: {
        files,
        profiles,
        user,
    },
})

export default store
