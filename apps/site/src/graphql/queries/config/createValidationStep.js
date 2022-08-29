import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const createValidationStep = gql`
    mutation createValidationStep($createStep: CreateValidationStepDto!) {
        createValidationStep(createStep: $createStep) {
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
