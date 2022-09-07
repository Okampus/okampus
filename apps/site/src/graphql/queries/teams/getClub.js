import gql from 'graphql-tag'
import { fullTeamFragment } from '@/graphql/fragments/fullTeamFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

export const getClub = gql`
    query club($id: Int!) {
        clubById(id: $id) {
            ...FullTeamInfo
            activeMembers {
                id
                role
                user {
                    ...PartialUserInfo
                }
            }
            forms {
                id
                type
                name
                description
                schema
                updatedAt
            }
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
    ${partialUserFragment}
`
