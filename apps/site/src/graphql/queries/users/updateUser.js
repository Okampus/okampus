import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const updateUser = gql`
    mutation updateUser($id: String!, $user: UpdateUserDto!) {
        updateUser(id: $id, user: $user) {
            ...PartialUserInfo
            finishedIntroduction
            finishedOnboarding
        }
    }
    ${partialUserFragment}
`
