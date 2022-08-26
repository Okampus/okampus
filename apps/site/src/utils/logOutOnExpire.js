import { emitter } from '@/shared/modules/emitter'
import setToHappen from '@/utils/setToHappen'

import { useCookies } from 'vue3-cookies'
import { showWarningToast } from './toast'
const { cookies } = useCookies()

const logOutExpired = () => {
    emitter.emit('logout')
    showWarningToast('Votre session a expiré, reconnectez-vous pour accéder à Okampus 🔐', { duration: -1 })
}

export const getExpirationDate = () => {
    const parseIntCookie = (cookie) => parseInt(cookie.split(':')[1].split('.')[0])
    try {
        const expiresIn = parseIntCookie(cookies.get('accessTokenExpiresIn'))
        return new Date(Date.now() + expiresIn).valueOf()
    } catch {
        return Date.now()
    }
}

export const logOutOnExpire = (expirationDate) => {
    console.log('EXPIRATION DATE', expirationDate, expirationDate - Date.now())
    !expirationDate || expirationDate - Date.now() < 0
        ? logOutExpired()
        : setToHappen(logOutExpired, expirationDate)
}
