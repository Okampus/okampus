import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const updateEvent = gql`
    mutation updateEvent($id: Int!, $updateEvent: UpdateTeamEventDto!) {
        updateEvent(id: $id, updateEvent: $updateEvent) {
            id
            createdAt
            description
            price
            location
            name
            start
            end
            state
            team {
                id
                ...PartialTeamInfo
            }
            registrationForm {
                id
                schema
            }
            supervisor {
                user {
                    ...PartialUserInfo
                }
                role
            }
            registrations {
                id
                status
                user {
                    ...PartialUserInfo
                }
            }
            userRegistration {
                id
                status
                formSubmission
            }
            lastValidationStep {
                id
                name
                step
            }
            eventValidationSubmission
        }
    }
    ${partialUserFragment}
    ${partialTeamFragment}
`
