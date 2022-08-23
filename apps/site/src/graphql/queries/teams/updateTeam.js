import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'
import gql from 'graphql-tag'

// TODO: optimize this query
export const updateTeam = gql`
    mutation updateTeam($id: Int!, $team: UpdateTeamDto!) {
        updateTeam(id: $id, team: $team) {
            ...FullTeamInfo
        }
    }
    ${fullTeamFragment}
`
