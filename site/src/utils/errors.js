import { errorCodes } from '@/shared/errors/app-exceptions.enum'

export const getStatus = (res) => res?.status?.toString() ?? errorCodes.NETWORK_ERROR
