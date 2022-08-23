import gql from 'graphql-tag'
import { fileFragment } from '@/graphql/fragments/fileFragment'

export const getTeamFiles = gql`
    query teamFiles($id: Int!) {
        clubById(id: $id) {
            id
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
    ${fileFragment}
`
