import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'
import gql from 'graphql-tag'

export const joinTeam = gql`
    mutation joinTeam($id: Int!, $request: CreateTeamMembershipRequestDto!) {
        joinTeam(id: $id, request: $request) {
            ...FullTeamInfo
        }
    }
    ${fullTeamFragment}
`
