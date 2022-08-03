import gql from 'graphql-tag'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { userFragment } from '@/graphql/fragments/userFragment'

export const getEvents = gql`
    query events {
        events {
            id
            createdAt
            description
            price
            location
            name
            start
            end
            team {
                ...PartialTeamInfo
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
            }
        }
    }
    ${partialTeamFragment}
    ${userFragment}
`
