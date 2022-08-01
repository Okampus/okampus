import gql from 'graphql-tag'
import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'

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
            userRegistration {
                id
                status
            }
        }
    }
    ${partialTeamFragment}
`
