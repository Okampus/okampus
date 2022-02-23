import { emitter } from '@/shared/modules/emitter'
import { useCookies } from 'vue3-cookies'
import setToHappen from './setToHappen'

const timeStampRegex = /s:(?<timestamp>[0-9]*)/

export default function logOutOnExpire() {
    const cookies = useCookies().cookies
    if (cookies.get('accessTokenExpiresAt')) {
        const expirationDate = parseInt(
            cookies.get('accessTokenExpiresAt').match(timeStampRegex).groups.timestamp,
        )

        const logOutOnExpire = () => {
            emitter.emit('show-toast', {
                message: 'Votre session a expiré.',
                type: 'warning',
            })
            emitter.emit('logout')
        }

        if (expirationDate - Date.now() < 0) {
            logOutOnExpire()
        } else {
            setToHappen(logOutOnExpire, expirationDate)
        }
    }
}
