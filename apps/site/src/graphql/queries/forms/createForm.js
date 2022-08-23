import gql from 'graphql-tag'

export const createForm = gql`
    mutation createForm($id: Int!, $createForm: CreateTeamFormDto!) {
        createTeamForm(id: $id, createForm: $createForm) {
            id
            forms {
                id
                name
                description
                schema
                updatedAt
            }
        }
    }
`
