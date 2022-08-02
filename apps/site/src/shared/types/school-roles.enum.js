export const DEFAULT_ROLE_NAME = 'NoRole'
export const STUDENT = 'Student'
export const TEACHER = 'Teacher'
export const ADMIN = 'Admin'

export const ROLES = [
    {
        key: STUDENT,
        fr: 'Étudiant',
        en: 'Student',
        icon: 'graduation-cap',
        color: 'neutral',
    },
    {
        key: TEACHER,
        fr: 'Professeur',
        en: 'Teacher',
        icon: 'school',
        color: 'blue',
    },
    {
        key: ADMIN,
        fr: 'Staff',
        en: 'Staff',
        icon: 'shield-alt',
        color: 'red',
    },
    {
        key: DEFAULT_ROLE_NAME,
        fr: 'N/A',
        en: 'N/A',
        icon: 'ghost',
        color: 'gray',
    },
]

export const DEFAULT_ROLE = ROLES.find((role) => role.key === DEFAULT_ROLE_NAME)
