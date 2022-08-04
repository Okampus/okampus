import { i18n } from '@/shared/modules/i18n'

export const POST = 'Post'
export const REPLY = 'Reply'
export const COMMENT = 'Comment'

export const ENDPOINTS = {
    [POST]: 'threads',
    [REPLY]: 'replies',
    [COMMENT]: 'comments',
}

export const contentTypeNames = {
    [POST]: {
        key: 'content',
        demonstrative: { fr: 'ce post', en: 'this post' },
        name: {
            fr: 'post',
            en: 'post',
        },
        frFeminine: false,
    },
    [REPLY]: {
        key: 'content',
        demonstrative: { fr: 'cette réponse', en: 'this reply' },
        name: {
            fr: 'réponse',
            en: 'reply',
        },
        frFeminine: true,
    },
    [COMMENT]: {
        key: 'comment',
        demonstrative: { fr: 'ce commentaire', en: 'this comment' },
        name: {
            fr: 'commentaire',
            en: 'comment',
        },
        frFeminine: false,
    },
}

export const getContentName = (kind) => contentTypeNames[kind].name[i18n.global.locale.value]
export const getContentDemonstrative = (kind) =>
    contentTypeNames[kind].demonstrative[i18n.global.locale.value]
export const isContentFeminine = (kind) =>
    i18n.global.locale.value == 'fr' && contentTypeNames[kind].frFeminine
