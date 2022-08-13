import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getConfig = gql`
    query getTenantById($id: String!) {
        tenantById(id: $id) {
            id
            logo
            logoDark
            validationSteps {
                id
                name
                step
                users {
                    ...UserInfo
                }
            }
            userValidations {
                id
                step
                name
            }
        }
    }
    ${userFragment}
`