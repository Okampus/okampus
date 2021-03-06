export const errorCodes = {
    SERVER_ERROR: '500',
    NOT_FOUND: '404',
    FORBIDDEN: '403',
    UNAUTHORIZED: '401',
    BAD_REQUEST: '400',
    NETWORK_ERROR: '0',
    OFFLINE: 'OFFLINE',
    UNKNOWN: 'UNKNOWN',
}

export const messages = {
    [errorCodes.SERVER_ERROR]: {
        fr: {
            error: '500 Erreur Serveur',
            description: 'Une erreur est survenue sur le serveur lors de la requête.',
        },
        en: {
            error: '500 Server Error',
            description: 'An error occurred on the server while processing the request.',
        },
    },
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
    [errorCodes.NETWORK_ERROR]: {
        fr: {
            error: 'Erreur réseau',
            description: `L'API ${
                import.meta.env.VITE_API_URL
            } est hors ligne ou n'est pas accessible depuis ce réseau.`,
        },
        en: {
            error: 'Network error',
            description: `The API ${
                import.meta.env.VITE_API_URL
            } is offline or is not accessible from this network.`,
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
