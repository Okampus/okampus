import { emitter } from '@/shared/modules/emitter'
import { isEmpty } from 'lodash'

import setToHappen from './setToHappen'

const logOutExpired = () => {
    emitter.emit('logout')
    emitter.emit('show-toast', {
        message: 'Votre session a expiré.',
        type: 'warning',
    })
}

export default function logOutOnExpire(user) {
    if (!isEmpty(user)) {
        const expirationDate = parseInt(user.accessTokenExpiresAt)
        if (expirationDate - Date.now() < 0) {
            logOutExpired()
        } else {
            setToHappen(logOutExpired, expirationDate)
        }
    }
}
