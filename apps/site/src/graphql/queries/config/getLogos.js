import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getLogos = gql`
    query getLogos($id: String!) {
        getLogos(id: $id) {
            type
            file {
                createdAt
                name
                fileSize
                mimeType
                user {
                    ...UserInfo
                }
                url
            }
        }
    }
    ${userFragment}
`