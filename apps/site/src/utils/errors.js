import { errorCodes } from '@/shared/errors/app-exceptions.enum'

export const getStatusAxiosError = (err) => err.response?.status?.toString() ?? errorCodes.UNKNOWN
