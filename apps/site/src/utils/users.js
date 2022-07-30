import { ROLES, DEFAULT_ROLE } from '@/shared/types/school-roles.enum'
import { capitalize } from 'lodash'

export const fullname = (user) =>
    user.firstname && user.lastname ? `${user.firstname.split(' ')[0]} ${user.lastname}` : 'Anonyme'
export const getRole = (user) =>
    ROLES.find((role) => role.key === capitalize(user.schoolRole)) || DEFAULT_ROLE
