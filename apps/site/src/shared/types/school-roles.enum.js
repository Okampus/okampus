export const ROLES = [
    {
        key: 'Student',
        fr: 'Étudiant',
        en: 'Student',
        icon: 'graduation-cap',
        color: 'neutral',
    },
    {
        key: 'Teacher',
        fr: 'Prof.',
        en: 'Teacher',
        icon: 'school',
        color: 'blue',
    },
    {
        key: 'Admin',
        fr: 'Admin.',
        en: 'Admin.',
        icon: 'shield-alt',
        color: 'red',
    },
    {
        key: 'NoRole',
        fr: 'N/A',
        en: 'N/A',
        icon: 'ghost',
        color: 'gray',
    },
]

export const DEFAULT_ROLE_NAME = 'NoRole'
export const DEFAULT_ROLE = ROLES.find((role) => role.key === DEFAULT_ROLE_NAME)
