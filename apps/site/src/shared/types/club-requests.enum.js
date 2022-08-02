export const APPROVED = 'Approved'
export const REJECTED = 'Rejected'
export const PENDING = 'Pending'

export const statusNames = {
    [APPROVED]: {
        fr: 'Approuvé',
        en: 'Approved',
        icon: 'fa-check',
    },
    [REJECTED]: {
        fr: 'Refusé',
        en: 'Refused',
        icon: 'fa-xmark',
    },
    [PENDING]: {
        fr: 'En attente',
        en: 'Pending',
        icon: 'fa-clock',
    },
}
