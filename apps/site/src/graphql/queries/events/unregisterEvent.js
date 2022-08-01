import gql from 'graphql-tag'

export const unregisterEvent = gql`
    mutation unregisterEvent($id: Int!) {
        updateTeamEventRegistration(id: $id, registration: { status: Absent }) {
            id
            status
        }
    }
`
