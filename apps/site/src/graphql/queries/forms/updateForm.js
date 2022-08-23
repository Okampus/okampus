import gql from 'graphql-tag'

export const updateForm = gql`
    mutation updateForm($id: Int!, $updateForm: UpdateTeamFormDto!) {
        updateTeamForm(id: $id, updateForm: $updateForm) {
            id
            name
            description
            schema
            updatedAt
        }
    }
`
