import { i18n } from '../../modules/i18n'
import { clubRoleNames } from '../../types/club-roles.enum'

const roles = Object.entries(clubRoleNames).map(([value, name]) => ({
    value,
    label: name[i18n.global.locale.value],
}))

export const DEFAULT_JOIN_FORM_SCHEMA = [
    {
        $el: 'h1',
        attrs: { class: 'mb-8' },
        children: ['Vous vous apprêtez à rejoindre ', { $el: 'u', children: ['$club.name'] }, ' 🎉'],
    },
    {
        $formkit: 'radio',
        label: 'Rôle souhaité 🎩',
        name: 'role',
        validation: 'required',
        help: 'Quel rôle souhaitez-vous obtenir ?',
        options: roles,
        validationMessages: {
            required: "Choisissez un rôle pour rejoindre l'équipe 🎩",
        },
    },
    {
        $formkit: 'text',
        name: 'motivation',
        validation: 'required',
        help: "Pourquoi souhaitez-vous rejoindre l'assocation ?",
        label: 'Motivation pour rejoindre 💬',
        validationMessages: {
            required: "Donnez une motivation pour que l'équipe puisse approuver votre demande 💬",
        },
    },
    {
        $formkit: 'text',
        name: 'competence',
        label: 'Vos compétences pour ce rôle 💪',
        help: 'Quelles compétences avez-vous pour ce rôle ?',
    },
]

export const EVENT_REGISTRATION_STATUS_FORM_SCHEMA = [
    {
        $el: 'h1',
        attrs: { class: 'mb-8' },
        children: ['$event.name'],
    },
    {
        $formkit: 'radio',
        name: 'sure',
        label: 'Êtes-vous sûr de venir ? 🤔',
        options: [
            {
                value: 'Sure',
                label: 'Oui, je suis sûr ! 🤗',
            },
            {
                value: 'Maybe',
                label: "Non, je suis susceptible d'être absent 😢",
            },
        ],
        validation: 'required',
    },
]

export const DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA = [...EVENT_REGISTRATION_STATUS_FORM_SCHEMA]
