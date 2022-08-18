import gql from 'graphql-tag'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

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
                ...PartialUserInfo
            }
            content {
                id
            }
        }
        assignedUsers {
            ...PartialUserInfo
        }
        participants {
            ...PartialUserInfo
        }
        createdAt
        updatedAt
    }
    ${partialUserFragment}
`
