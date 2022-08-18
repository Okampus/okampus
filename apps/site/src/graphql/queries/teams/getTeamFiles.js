import gql from 'graphql-tag'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

export const getTeamFiles = gql`
    query teamFiles($id: Int!) {
        clubById(id: $id) {
            id
            teamFiles {
                id
                type
                description
                file {
                    id
                    user {
                        ...PartialUserInfo
                    }
                }
            }
        }
    }
    ${partialUserFragment}
`
