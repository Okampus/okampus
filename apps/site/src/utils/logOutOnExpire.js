import { emitter } from '@/shared/modules/emitter'
import setToHappen from '@/utils/setToHappen'

import { useCookies } from 'vue3-cookies'
import { showWarningToast } from './toast'
const { cookies } = useCookies()

const logOutExpired = () => {
    emitter.emit('logout')
    showWarningToast('Votre session a expiré, reconnectez-vous pour accéder à Okampus 🔐', { duration: -1 })
}

const parseIntCookie = (cookie) => parseInt(cookie.split(':')[1].split('.')[0])
export const getAccessTokenExpiration = () => {
    try {
        return parseIntCookie(cookies.get('accessTokenExpiresAt'))
    } catch {
        return null
    }
}

export const isAccessTokenExpired = () => {
    try {
        return parseIntCookie(cookies.get('accessTokenExpiresAt')) < Date.now()
    } catch {
        return false
    }
}

export const logOutOnExpire = () => {
    const expirationDate = getAccessTokenExpiration()
    !expirationDate || expirationDate < Date.now()
        ? logOutExpired()
        : setToHappen(logOutExpired, expirationDate)
}
