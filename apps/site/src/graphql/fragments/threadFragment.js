import gql from 'graphql-tag'
import { userFragment } from './userFragment'

export const threadFragment = gql`
    fragment ThreadInfo on Thread {
        id
        title
        type
        tags {
            name
            color
        }
        opValidation {
            id
            active
            content {
                id
            }
        }
        adminValidations {
            id
            active
            user {
                ...UserInfo
            }
            content {
                id
            }
        }
        createdAt
        updatedAt
    }
    ${userFragment}
`
