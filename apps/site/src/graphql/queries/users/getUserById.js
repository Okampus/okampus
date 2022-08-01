import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getUser = gql`
    query userById($id: String!) {
        userById(id: $id) {
            ...UserInfo
            teamMemberships {
                role
                team {
                    ...PartialTeamInfo
                }
            }
        }
    }
    ${userFragment}
    ${partialTeamFragment}
`
