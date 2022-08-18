import gql from 'graphql-tag'
import { partialUserFragment } from './userFragment'

export const contentFragment = gql`
    fragment ContentInfo on Content {
        id
        kind
        body
        createdAt
        updatedAt
        isVisible
        upvoteCount
        downvoteCount
        favoriteCount
        interactions {
            userFavorited
            userVoted
            userReported {
                reason
            }
            reactions {
                user {
                    ...PartialUserInfo
                }
                value
            }
        }
        lastEdit {
            createdAt
            editedBy {
                ...PartialUserInfo
            }
        }
        author {
            ...PartialUserInfo
        }
    }
    ${partialUserFragment}
`
