import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const registerEvent = gql`
    mutation registerEvent($id: Int!, $registration: CreateTeamEventRegistrationDto!) {
        addTeamEventRegistration(id: $id, registration: $registration) {
            id
            registrations {
                id
                user {
                    ...UserInfo
                }
                status
            }
            userRegistration {
                id
                status
                formSubmission
            }
        }
    }
    ${userFragment}
`
