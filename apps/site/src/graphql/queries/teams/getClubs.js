import gql from 'graphql-tag'
import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'

export const getClubs = gql`
    query allClubs {
        clubs {
            ...FullTeamInfo
        }
    }
    ${fullTeamFragment}
`
