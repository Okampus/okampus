import { emitter } from '@/shared/modules/emitter'
import { useAuthStore } from '@/store/auth.store'
import { isEmpty } from 'lodash'
import { useCookies } from 'vue3-cookies'

import setToHappen from './setToHappen'

const timeStampRegex = /s:(?<timestamp>[0-9]*)/

const logOut = () => {
    if (!isEmpty(useAuthStore().user)) {
        emitter.emit('show-toast', {
            message: 'Votre session a expiré.',
            type: 'warning',
        })
        emitter.emit('logout')
    }
}

export default function logOutOnExpire() {
    const cookies = useCookies().cookies
    if (cookies.get('accessTokenExpiresAt')) {
        const expirationDate = parseInt(
            cookies.get('accessTokenExpiresAt').match(timeStampRegex).groups.timestamp,
        )

        if (expirationDate - Date.now() < 0) {
            logOut()
        } else {
            setToHappen(logOut, expirationDate)
        }
    } else {
        logOut()
    }
}
