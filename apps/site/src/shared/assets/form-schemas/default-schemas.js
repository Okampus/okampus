import { i18n } from '@/shared/modules/i18n'
import { clubRoleNames } from '@/shared/types/club-roles.enum'
// import { searchUsers } from '@/graphql/queries/users/searchUsers'

const roles = Object.entries(clubRoleNames).map(([value, name]) => ({
    value,
    label: name[i18n.global.locale.value],
}))

export const DEFAULT_JOIN_FORM_SCHEMA = [
    {
        $el: 'h1',
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

export const DEFAULT_TENANT_EVENT_VALIDATION_FORM_SCHEMA = [
    {
        $el: 'h1',
        children: ["Formulaire de validation d'événement"],
    },
    {
        $el: 'h4',
        children: [
            "Tout événement doit être validé par l'administration scolaire avant d'être publié sur Okampus. Remplissez ce formulaire pour que votre événement soit validé ✅",
        ],
    },
    // {
    //     $formkit: 'multisearch',
    //     searchQuery: searchUsers,
    //     queryName: 'searchUsers',
    //     name: 'managers',
    //     placeholder: "Responsable de l'événement 🚩",
    //     validation: 'required',
    // },
    {
        $formkit: 'number',
        name: 'minAttendance',
        label: 'Nombre de participants minimum estimé 🧮',
        validation: 'required',
    },
    {
        $formkit: 'number',
        name: 'maxAttendance',
        label: 'Nombre de participants maximum estimé 🧮',
        validation: 'required',
    },
    {
        $formkit: 'textarea',
        name: 'risks',
        label: "Risques potentiels encourus lors de l'événement 🚨",
        validation: 'required|length:3',
        help: "Entrer 'N/A' si non-applicable",
    },
    {
        $formkit: 'textarea',
        name: 'riskPrevention',
        label: 'Moyens mis en place pour la prévention de risque 🦺',
        validation: 'required|length:3',
        help: "Entrer 'N/A' si non-applicable",
    },
]
