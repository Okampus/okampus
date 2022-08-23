import gql from 'graphql-tag'
import { partialUserFragment } from './userFragment'

export const fileFragment = gql`
    fragment FileInfo on FileUpload {
        id
        name
        fileSize
        url
        user {
            ...PartialUserInfo
        }
    }
    ${partialUserFragment}
`
