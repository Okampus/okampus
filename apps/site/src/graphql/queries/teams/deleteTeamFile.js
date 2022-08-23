import { fileFragment } from '@/graphql/fragments/fileFragment'
import gql from 'graphql-tag'

export const deleteTeamFile = gql`
    mutation deleteTeamFile($id: String!) {
        deleteTeamFile(id: $id) {
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
