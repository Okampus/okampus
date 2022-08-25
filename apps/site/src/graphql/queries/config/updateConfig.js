import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const updateConfig = gql`
    mutation updateConfig($id: String!, $updateTenant: UpdateTenantDto!) {
        updateTenant(id: $id, updateTenant: $updateTenant) {
            id
            logo
            logoDark
            validationSteps {
                id
                name
                step
                users {
                    ...PartialUserInfo
                }
            }
            userValidations {
                id
                step
                name
            }
            eventValidationForm
        }
    }
    ${partialUserFragment}
`
