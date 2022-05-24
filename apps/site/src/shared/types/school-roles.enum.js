export const ROLES = [
    {
        key: 'student',
        fr: 'Étudiant',
        en: 'Student',
        icon: 'graduation-cap',
        color: 'neutral',
    },
    {
        key: 'teacher',
        fr: 'Prof.',
        en: 'Teacher',
        icon: 'school',
        color: 'blue',
    },
    {
        key: 'admin',
        fr: 'Admin.',
        en: 'Admin.',
        icon: 'shield-alt',
        color: 'red',
    },
    {
        key: 'no-role',
        fr: 'N/A',
        en: 'N/A',
        icon: 'ghost',
        color: 'gray',
    },
]

export const DEFAULT_ROLE_NAME = 'no-role'
export const DEFAULT_ROLE = ROLES.find((role) => role.key === DEFAULT_ROLE_NAME)
