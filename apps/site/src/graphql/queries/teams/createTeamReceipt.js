import { fileFragment } from '@/graphql/fragments/fileFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const createTeamReceipt = gql`
    mutation createTeamReceipt($file: Upload!, $createReceipt: CreateTeamReceiptDto!) {
        addTeamReceipt(file: $file, createReceipt: $createReceipt) {
            id
            file {
                ...FileInfo
            }
            description
            payedAt
            payedBy {
                ...PartialUserInfo
            }
            paymentLocation
            paymentMethod
            amount
            amountPayed
        }
    }
    ${fileFragment}
    ${partialUserFragment}
`
