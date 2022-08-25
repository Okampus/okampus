import gql from 'graphql-tag'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

export const getEvent = gql`
    query eventById($id: Int!) {
        eventById(id: $id) {
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
    ${partialTeamFragment}
    ${partialUserFragment}
`
