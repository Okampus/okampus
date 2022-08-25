import { partialUserFragment } from '@/graphql/fragments/userFragment'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import gql from 'graphql-tag'

export const createEvent = gql`
    mutation createEvent($id: Int!, $createEvent: CreateTeamEventDto!) {
        createEvent(id: $id, createEvent: $createEvent) {
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
                users {
                    ...PartialUserInfo
                }
            }
            eventValidationSubmission
        }
    }
    ${partialUserFragment}
    ${partialTeamFragment}
`
