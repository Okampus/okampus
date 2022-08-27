import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const validateEvent = gql`
    mutation validateEvent($id: Int!, $createValidation: CreateTeamEventValidationDto!) {
        validateEvent(id: $id, createValidation: $createValidation) {
            id
            lastValidationStep {
                id
                name
                step
            }
            state
        }
    }
    ${partialUserFragment}
`
