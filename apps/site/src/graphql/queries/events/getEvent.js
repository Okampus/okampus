import gql from 'graphql-tag'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { userFragment } from '@/graphql/fragments/userFragment'

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
                form
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
        }
    }
    ${partialTeamFragment}
    ${userFragment}
`
