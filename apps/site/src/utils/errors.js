import { errorCodes } from '@/shared/errors/app-exceptions.enum'
import { graphQLtoHttpError } from '@/shared/errors/graphql-exceptions.enum'

export const getStatusAxiosError = (err) => err.response?.status?.toString() ?? errorCodes.UNKNOWN

export const getGraphQLErrorCode = (apolloErrors) => {
    const errors = [
        ...(apolloErrors?.graphQLErrors ?? []),
        ...(apolloErrors?.clientErrors ?? []),
        ...(apolloErrors?.networkError?.result?.errors ?? []),
    ]

    return graphQLtoHttpError[errors[0]?.extensions?.code] ?? errorCodes.NETWORK_ERROR
}

export const TOAST_ERRORS = {
    [errorCodes.NETWORK_ERROR]: {
        type: 'error',
        message: {
            fr: "[Erreur Réseau] L'API est hors ligne ou n'est pas accessible depuis ce réseau.",
            en: '[Network Error] The API is offline or cannot be accessed on this network.',
        },
    },
    [errorCodes.SERVER_ERROR]: {
        type: 'error',
        message: {
            fr: '[Erreur Serveur] Une erreur est survenue sur le serveur lors de la requête.',
            en: '[Server Error] An error occurred on the server while processing the request.',
        },
    },
    [errorCodes.NOT_FOUND]: {
        type: 'error',
        message: {
            fr: "[Erreur] La ressource n'a pas pu être trouvée ou n'existe pas.",
            en: '[Error] This resource could not be found or does not exist.',
        },
    },
    [errorCodes.FORBIDDEN]: {
        type: 'error',
        message: {
            fr: "[Interdit] Vous n'êtes pas autorisé à accéder à cette ressource.",
            en: '[Forbidden] You are not authorized to access this resource.',
        },
    },
    [errorCodes.UNAUTHORIZED]: {
        type: 'error',
        message: {
            fr: '[Déconnecté] Vous devez être connecté pour accéder à cette ressource.',
            en: '[Unauthorized] You must be connected to access this resource.',
        },
    },
    [errorCodes.BAD_REQUEST]: {
        type: 'error',
        message: {
            fr: '[Mauvaise Requête] La requête est mal formée.',
            en: '[Bad Request] The request is malformed.',
        },
    },
    [errorCodes.OFFLINE]: {
        type: 'error',
        message: {
            fr: "[Erreur Réseau] Ce navigateur n'est pas connecté à Internet.",
            en: '[Network Error] This browser is not connected to the Internet.',
        },
    },
    [errorCodes.UNKNOWN]: {
        type: 'error',
        message: {
            fr: '[Erreur] Erreur inconnue.',
            en: '[Error] Unknown error.',
        },
    },
}
