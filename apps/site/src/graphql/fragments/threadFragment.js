import gql from 'graphql-tag'
import { userFragment } from '@/graphql/fragments/userFragment'

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
        assignedUsers {
            ...UserInfo
        }
        participants {
            ...UserInfo
        }
        createdAt
        updatedAt
    }
    ${userFragment}
`
