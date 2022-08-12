import { searchUsers } from '@/graphql/queries/users/searchUsers'

export const validationStepForm = [
    {
        $el: 'h1',
        attrs: { class: 'mb-8' },
        children: ['Ajouter une étape de validation'],
    },
    {
        $formkit: 'floating',
        inputClass: 'h-12',
        name: 'name',
        floatingLabel: "Nom de l'étape",
        validation: 'required',
    },
    {
        $formkit: 'multisearch',
        searchQuery: searchUsers,
        queryName: 'searchUsers',
        name: 'users',
        placeholder: 'Validateurs',
        validation: 'required',
    },
]
