export const OWNER = 'Owner'
export const COOWNER = 'Coowner'
export const TREASURER = 'Treasurer'
export const SECRETARY = 'Secretary'
export const MANAGER = 'Manager'
export const MEMBER = 'Member'

export const clubRoleNames = {
    [OWNER]: {
        'fr': 'Président',
        'en': 'President',
    },
    [COOWNER]: {
        'fr': 'Vice-Président',
        'en': 'Vice-President',
    },
    [TREASURER]: {
        'fr': 'Trésorier',
        'en': 'Treasurer',
    },
    [SECRETARY]: {
        'fr': 'Secrétaire',
        'en': 'Secretary',
    },
    [MANAGER]: {
        'fr': 'Membre du Bureau',
        'en': 'Manager',
    },
    [MEMBER]: {
        'fr': 'Membre',
        'en': 'Member',
    },
}

export const specialRoles = [OWNER, TREASURER, SECRETARY, COOWNER, MANAGER]
