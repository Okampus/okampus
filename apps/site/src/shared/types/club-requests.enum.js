export const APPROVED = 'Approved'
export const REJECTED = 'Rejected'
export const PENDING = 'Pending'

export const statusNames = {
    [APPROVED]: {
        fr: 'Approuvé',
        en: 'Approved',
        icon: 'fa fa-check',
        textClass: 'text-green-500',
        bgClass: 'button-green',
    },
    [REJECTED]: {
        fr: 'Refusé',
        en: 'Refused',
        icon: 'fa fa-xmark',
        textClass: 'text-red-500',
        bgClass: 'button-red',
    },
    [PENDING]: {
        fr: 'En attente',
        en: 'Pending',
        icon: 'fa fa-clock',
        textClass: 'text-gray-500',
        bgClass: 'button-grey',
    },
}
