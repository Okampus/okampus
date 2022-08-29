import { emitter } from '@/shared/modules/emitter'
import setToHappen from '@/utils/setToHappen'

import { useCookies } from 'vue3-cookies'
import { showWarningToast } from './toast'
const { cookies } = useCookies()

const logOutExpired = () => {
    emitter.emit('logout')
    showWarningToast('Votre session a expiré, reconnectez-vous pour accéder à Okampus 🔐', { duration: -1 })
}

export const logOutOnExpire = () => {
    const parseIntCookie = (cookie) => parseInt(cookie.split(':')[1].split('.')[0])

    let expirationDate
    try {
        expirationDate = parseIntCookie(cookies.get('accessTokenExpiresAt'))
    } catch {
        expirationDate = null
    }

    !expirationDate || expirationDate - Date.now() < 0
        ? logOutExpired()
        : setToHappen(logOutExpired, expirationDate)
}
