import { ROLES, DEFAULT_ROLE } from '@/shared/types/school-roles.enum'

export const fullname = (user) =>
    user?.fullname ?? (user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : 'Anonyme')
export const getRole = (user) => ROLES.find((role) => role.key === user?.schoolRole) || DEFAULT_ROLE
