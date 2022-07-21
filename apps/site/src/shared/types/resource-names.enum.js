export const DEFAULT = 'resource'
export const THREAD = 'thread'
export const USER = 'user'
export const CLUB = 'club'
export const EVENT = 'event'
export const REPORT = 'report'

export const RESOURCE_NAMES = {
    [DEFAULT]: {
        demonstrative: { fr: 'cette ressource', en: 'this resource' },
        name: { fr: 'ressource', en: 'resource' },
        frFeminine: true,
    },
    [THREAD]: {
        demonstrative: { fr: 'ce post', en: 'this post' },
        name: { fr: 'post', en: 'post' },
        frFeminine: false,
    },
    [USER]: {
        demonstrative: { fr: 'cet utilisateur', en: 'this user' },
        name: { fr: 'utilisateur', en: 'user' },
        frFeminine: false,
    },
    [CLUB]: {
        demonstrative: { fr: 'cette association', en: 'this club' },
        name: { fr: 'association', en: 'club' },
        frFeminine: true,
    },
    [EVENT]: {
        demonstrative: { fr: 'cet événement', en: 'this event' },
        name: { fr: 'événement', en: 'event' },
        frFeminine: false,
    },
    [REPORT]: {
        demonstrative: { fr: 'ce report', en: 'this report' },
        name: { fr: 'report', en: 'report' },
        frFeminine: false,
    },
}
