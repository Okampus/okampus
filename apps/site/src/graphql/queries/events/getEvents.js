import gql from 'graphql-tag'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { partialUserFragment, userFragment } from '@/graphql/fragments/userFragment'

export const getEvents = gql`
    query events($filter: ListTeamEventsDto!) {
        events(filter: $filter) {
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
                    ...UserInfo
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
    ${partialTeamFragment}
    ${userFragment}
    ${partialUserFragment}
`
