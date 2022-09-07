import gql from 'graphql-tag'
import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'

export const getFullClubs = gql`
    query fullClubs {
        clubs {
            ...FullTeamInfo
            teamFiles {
                id
                type
                description
                active
                file {
                    ...FileInfo
                }
            }
        }
    }
    ${fullTeamFragment}
`
