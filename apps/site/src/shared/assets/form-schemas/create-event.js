import { searchUsers } from '@/graphql/queries/users/searchUsers'

export const createEventForm = [
    {
        $el: 'h1',
        children: ['Créer un nouvel événement 🎇'],
    },
    {
        $formkit: 'floating',
        name: 'name',
        floatingLabel: "Nom de l'événement",
        validation: 'required|length:5,100',
    },
    {
        $formkit: 'date',
        name: 'start',
        label: "Début estimé de l'événement",
        validation: 'required',
    },
    {
        $formkit: 'date',
        name: 'end',
        label: "Fin estimée de l'événement",
        validation: 'required',
    },
    {
        $formkit: 'floating',
        name: 'location',
        floatingLabel: "Lieu de l'événement",
        validation: 'required|length:5,100',
    },
    {
        $formkit: 'number',
        name: 'price',
        label: "Prix de l'entrée (en €)",
        validation: 'required|numeric',
    },
    {
        $formkit: 'textarea',
        name: 'description',
        label: "Programme de l'événement",
        validation: 'required|length:5,1000',
    },
    {
        $formkit: 'multisearch',
        searchQuery: searchUsers,
        queryName: 'searchUsers',
        name: 'supervisor',
        placeholder: 'Responsable',
        validation: 'required|length:0,1',
    },
    {
        $formkit: 'checkbox',
        name: 'private',
        label: 'Événement interne/privé ?',
        help: "Cochez cette case pour restreindre la visibilité de l'événement aux membres de l'association.",
    },
]
