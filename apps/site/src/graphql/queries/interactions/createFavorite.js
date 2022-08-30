import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const favorite = gql`
    mutation createFavorite($id: Int!, $favorite: Boolean!) {
        createFavorite(id: $id, favorite: $favorite) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`
