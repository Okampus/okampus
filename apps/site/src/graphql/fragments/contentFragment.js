import gql from 'graphql-tag'

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
                    id
                    firstname
                    lastname
                    avatar
                    schoolRole
                }
                value
            }
        }
        lastEdit {
            createdAt
            editedBy {
                id
                firstname
                lastname
                avatar
                schoolRole
            }
        }
        author {
            id
            firstname
            lastname
            avatar
            schoolRole
        }
    }
`
