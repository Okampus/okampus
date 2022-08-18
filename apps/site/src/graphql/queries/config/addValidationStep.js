import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const addValidationStep = gql`
    mutation addValidationStep($createStep: CreateValidationStepDto!) {
        addValidationStep(createStep: $createStep) {
            id
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
        }
    }
    ${partialUserFragment}
`
