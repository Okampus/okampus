import { contentFragment } from '@/graphql/fragments/contentFragment'
import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getReports = gql`
    query getReports {
        reports {
            user {
                ...UserInfo
            }
            target {
                ...UserInfo
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
    ${userFragment}
`
