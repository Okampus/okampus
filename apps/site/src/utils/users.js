import schoolRolesEnum from '@/shared/types/school-roles.enum'

export const fullname = (user) => `${user.firstname.split(' ')[0]} ${user.lastname}`
export const getRole = (user) => schoolRolesEnum.find((role) => role.key === user.schoolRole)
