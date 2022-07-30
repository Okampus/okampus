export const CLASS = 'Class'
export const SECTOR = 'Sector'
export const YEAR = 'Year'
export const PROGRAM = 'Program'
export const EVERYONE = 'Everyone'

export const SCHOOL_GROUP_TYPES = {
    [CLASS]: {
        fr: 'Classe',
        en: 'Class',
        icon: '📒',
        option: {
            name: 'Ma classe',
            subtitle: 'Ne concerne que les',
            prefix: '📒',
        },
    },
    [SECTOR]: {
        fr: 'Secteur',
        en: 'Sector',
        icon: '📚',
        option: {
            name: 'Ma filière',
            subtitle: 'Ne concerne que les',
            prefix: '📚',
        },
    },
    [YEAR]: {
        fr: 'Année',
        en: 'Year',
        icon: '🎓',
        option: {
            name: 'Ma promotion',
            subtitle: 'Ne concerne que les',
            prefix: '🎓',
        },
    },
    [PROGRAM]: {
        fr: 'Programme',
        en: 'Program',
        icon: '💻',
        option: {
            name: 'Mon programme',
            subtitle: 'Ne concerne que les étudiants',
            prefix: '💻',
        },
    },
    [EVERYONE]: {
        fr: 'Tout le monde',
        en: 'Everyone',
        icon: '🏫',
        option: {
            value: 'everyone',
            name: 'Tout le monde',
            subtitle: 'Sujets généraux, interprogrammes...',
            prefix: '🏫',
        },
    },
}
