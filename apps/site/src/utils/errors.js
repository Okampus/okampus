import { errorCodes } from '@/shared/errors/app-exceptions.enum'

export const getStatusAxiosError = (err) => err.response?.status?.toString() ?? errorCodes.UNKNOWN

export const TOAST_ERRORS = {
    [errorCodes.NETWORK_ERROR]: {
        message: "ERREUR RÉSEAU : L'API est hors ligne ou n'est pas accessible depuis ce réseau.",
        type: 'error',
    },
}
