import { contentFragment } from '@/graphql/fragments/contentFragment'
import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getReports = gql`
    query getReports {
        reports {
            user {
                ...PartialUserInfo
            }
            target {
                ...PartialUserInfo
            }
            content {
                ...ContentInfo
                contentMaster {
                    id
                }
            }
            reason
        }
    }
    ${contentFragment}
    ${partialUserFragment}
`
