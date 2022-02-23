export const POST = 0
export const REPLY = 1
export const COMMENT = 2

export const ENDPOINTS = {
    0: 'threads',
    1: 'replies',
    2: 'comments',
}

export const contentTypeDemonstrative = {
    [POST]: { fr: 'ce post', en: 'this post', frFeminine: false },
    [REPLY]: { fr: 'cette réponse', en: 'this reply', frFeminine: true },
    [COMMENT]: { fr: 'ce commentaire', en: 'this comment', frFeminine: false },
}
