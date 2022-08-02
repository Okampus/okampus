import { errorCodes } from '@/shared/errors/app-exceptions.enum'
import { emitter } from '@/shared/modules/emitter'
import { i18n } from '@/shared/modules/i18n'
import { getGraphQLErrorCode, TOAST_ERRORS } from './errors'

export const showSuccessToast = (message, ...props) => {
    emitter.emit('show-toast', { type: 'success', message, ...props[0] })
}

export const showInfoToast = (message, ...props) => {
    emitter.emit('show-toast', { type: 'info', message, ...props[0] })
}

export const showWarningToast = (message, ...props) => {
    emitter.emit('show-toast', { type: 'warning', message, ...props[0] })
}

export const showErrorToast = (message, ...props) => {
    emitter.emit('show-toast', { type: 'error', message, ...props[0] })
}

export const showToastGraphQLError = (apolloErrors) => {
    const toast = { ...(TOAST_ERRORS[getGraphQLErrorCode(apolloErrors)] ?? TOAST_ERRORS[errorCodes.UNKNOWN]) }
    toast.message = toast.message[i18n.global.locale]
    emitter.emit('show-toast', toast)
}

export const WIP = (text) => {
    showInfoToast(text, { title: 'Ça arrive prochainement ✨ !', duration: -1 })
}
