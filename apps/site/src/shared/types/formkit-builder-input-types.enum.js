export const TEXT = 'text'
export const TEXTAREA = 'textarea'
export const NUMBER = 'number'
export const RADIO = 'radio'
export const MULTIUSER = 'multiuser'
export const CHECKLIST = 'checkbox'

export const OPTION_TYPES = [RADIO, CHECKLIST]

export const OPTIONS = [
    {
        name: 'Texte court',
        type: TEXT,
        icon: 'fa fa-align-left',
    },
    {
        name: 'Texte long',
        type: TEXTAREA,
        icon: 'fa fa-quote-left',
    },
    {
        name: 'Saisie de nombre',
        type: NUMBER,
        icon: 'fa fa-hashtag',
    },
    // {
    //     name: "Sélection d'utilisateurs",
    //     type: MULTIUSER,
    //     icon: 'fa fa-users',
    // },
    {
        name: 'Choix multiples',
        type: RADIO,
        icon: 'fa fa-rectangle-list',
    },
    {
        name: 'Cases à cocher',
        type: CHECKLIST,
        icon: 'fa fa-square-check',
    },
]
