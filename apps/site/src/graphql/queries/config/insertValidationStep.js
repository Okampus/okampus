import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const insertValidationStep = gql`
    mutation insertValidationStep($step: Int!, $atStep: Int!) {
        insertStep(step: $step, atStep: $atStep) {
            id
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
