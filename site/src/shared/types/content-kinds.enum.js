import { i18n } from '@/shared/modules/i18n'

export const POST = 0
export const REPLY = 1
export const COMMENT = 2

export const ENDPOINTS = {
    0: 'threads',
    1: 'replies',
    2: 'comments',
}

export const contentTypeNames = {
    [POST]: {
        demonstrative: { fr: 'ce post', en: 'this post' },
        name: {
            fr: 'post',
            en: 'post',
        },
        frFeminine: false,
    },
    [REPLY]: {
        demonstrative: { fr: 'cette réponse', en: 'this reply' },
        name: {
            fr: 'réponse',
            en: 'reply',
        },
        frFeminine: true,
    },
    [COMMENT]: {
        demonstrative: { fr: 'ce commentaire', en: 'this comment' },
        name: {
            fr: 'commentaire',
            en: 'comment',
        },
        frFeminine: false,
    },
}

export const getContentName = (kind) => contentTypeNames[kind].demonstrative[i18n.global.locale]
export const getContentDemonstrative = (kind) => contentTypeNames[kind].name[i18n.global.locale]
export const isContentFeminine = (kind) => i18n.global.locale == 'fr' && contentTypeNames[kind].frFeminine
