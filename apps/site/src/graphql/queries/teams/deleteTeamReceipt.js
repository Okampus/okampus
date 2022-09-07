import { fileFragment } from '@/graphql/fragments/fileFragment'
import gql from 'graphql-tag'

export const deleteTeamReceipt = gql`
    mutation deleteTeamReceipt($id: String!) {
        deleteTeamReceipt(id: $id) {
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
