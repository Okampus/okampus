import { emitter } from '@/shared/modules/emitter'
import { isEmpty } from 'lodash'
import setToHappen from '@/utils/logOutOnExpire'

import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const parseIntCookie = (cookie) => parseInt(cookie.split(':')[1].split('.')[0])

const logOutExpired = () => {
    emitter.emit('logout')
    emitter.emit('show-toast', {
        message: 'Votre session a expiré.',
        type: 'warning',
    })
}

export default function logOutOnExpire(user) {
    if (!isEmpty(user)) {
        const expiresAt = cookies.get('accessTokenExpiresAt')
        if (!expiresAt) logOutExpired()

        const expirationDate = parseIntCookie(cookies.get('accessTokenExpiresAt'))
        if (expirationDate - Date.now() < 0) {
            logOutExpired()
        } else {
            setToHappen(logOutExpired, expirationDate)
        }
    }
}
