import gql from 'graphql-tag'
import { fileFragment } from '@/graphql/fragments/fileFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

export const getTeamReceipts = gql`
    query teamFiles($teamId: Int!) {
        teamReceipts(teamId: $teamId) {
            id
            file {
                ...FileInfo
            }
            payedAt
            payedBy {
                ...PartialUserInfo
            }
            description
            paymentLocation
            paymentMethod
            amount
        }
    }
    ${fileFragment}
    ${partialUserFragment}
`
