export const errorCodes = {
    NOT_FOUND: '404',
    BAD_REQUEST: '400',
    UNAUTHORIZED: '401',
    FORBIDDEN: '403',
    NETWORK_ERROR: 'NETWORK_ERROR',
    OFFLINE: 'OFFLINE',
    UNKNOWN: 'UNKNOWN',
}

export const messages = {
    [errorCodes.NOT_FOUND]: {
        fr: {
            error: '404 Non trouvé',
            description: "Cette ressource n'existe pas.",
        },
        en: {
            error: '404 Not found',
            description: "This resource doesn't exist.",
        },
    },
    [errorCodes.BAD_REQUEST]: {
        fr: {
            error: '400 Mauvaise requête',
            description: 'La requête est mal formée.',
        },
        en: {
            error: '400 Bad request',
            description: 'The request is malformed.',
        },
    },
    [errorCodes.UNAUTHORIZED]: {
        fr: {
            error: '401 Non autorisé',
            description: 'Seuls les utilisateurs connectés peuvent accéder à cette page.',
        },
        en: {
            error: '401 Unauthorized',
            description: 'Only connected users can access this page.',
        },
    },
    [errorCodes.FORBIDDEN]: {
        fr: {
            error: '403 Interdit',
            description: 'Seuls les utilisateurs autorisés peuvent accéder à cette page.',
        },
        en: {
            error: '403 Forbidden',
            description: 'Only authorized users can access this page.',
        },
    },
    [errorCodes.NETWORK_ERROR]: {
        fr: {
            error: 'Erreur réseau',
            description: 'Une erreur réseau est survenue.',
        },
        en: {
            error: 'Network error',
            description: 'A network error occurred.',
        },
    },
    [errorCodes.OFFLINE]: {
        fr: {
            error: 'Erreur réseau - Hors ligne',
            description: "Ce navigateur n'est pas connecté à Internet.",
        },
        en: {
            error: 'Network error - Offline',
            description: 'This browser is not connected to the Internet.',
        },
    },
    [errorCodes.UNKNOWN]: {
        fr: {
            error: 'Erreur inconnue',
            description: 'Une erreur inconnue est survenue.',
        },
        en: {
            error: 'Unknown error',
            description: 'An unknown error occurred.',
        },
    },
}
