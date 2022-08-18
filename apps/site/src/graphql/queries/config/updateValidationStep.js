import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const updateValidationStep = gql`
    mutation updateValidationStep($id: Int!, $updateStep: UpdateValidationStepDto!) {
        updateValidationStep(id: $id, updateStep: $updateStep) {
            id
            name
            step
            users {
                ...PartialUserInfo
            }
        }
    }
    ${partialUserFragment}
`
