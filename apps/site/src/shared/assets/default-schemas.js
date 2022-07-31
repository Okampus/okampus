import { i18n } from '../modules/i18n'
import { clubRoleNames } from '../types/club-roles.enum'

const roles = Object.entries(clubRoleNames).map(([value, name]) => ({
    value,
    label: name[i18n.global.locale],
}))

export const DEFAULT_JOIN_FORM_SCHEMA = [
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
