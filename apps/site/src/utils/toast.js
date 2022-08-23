import { errorCodes } from '@/shared/errors/app-exceptions.enum'
import { emitter } from '@/shared/modules/emitter'
import { i18n } from '@/shared/modules/i18n'
import { getGraphQLErrorCode, TOAST_ERRORS } from './errors'

export const showSuccessToast = (message, props) => {
    emitter.emit('show-toast', { type: 'success', message, ...props })
}

export const showInfoToast = (message, props) => {
    emitter.emit('show-toast', { type: 'info', message, ...props })
}

export const showWarningToast = (message, props) => {
    emitter.emit('show-toast', { type: 'warning', message, ...props })
}

export const showErrorToast = (message, props) => {
    emitter.emit('show-toast', { type: 'error', message, ...props })
}

export const showToastGraphQLError = (apolloErrors, message = '') => {
    const toast = { ...(TOAST_ERRORS[getGraphQLErrorCode(apolloErrors)] ?? TOAST_ERRORS[errorCodes.UNKNOWN]) }
    toast.message = toast.message[i18n.global.locale.value]

    if (message) toast.title = message

    emitter.emit('show-toast', toast)
}

export const WIP = (text) => {
    showInfoToast(text, { title: 'Ça arrive prochainement ✨ !', duration: -1 })
}
