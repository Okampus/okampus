import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const favorite = gql`
    mutation favorite($id: Int!, $favorite: Boolean!) {
        favoriteContent(id: $id, favorite: $favorite) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`
