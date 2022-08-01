import gql from 'graphql-tag'
import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'

export const getClub = gql`
    query club($id: Int!) {
        clubById(id: $id) {
            ...FullTeamInfo
        }
    }
    ${fullTeamFragment}
`
