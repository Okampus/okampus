import { fileFragment } from '@/graphql/fragments/fileFragment'
import gql from 'graphql-tag'

export const createTeamFile = gql`
    mutation createTeamFile($file: Upload!, $createFile: CreateTeamFileDto!) {
        createTeamFile(file: $file, createFile: $createFile) {
            id
            teamFiles {
                id
                type
                description
                active
                file {
                    ...FileInfo
                }
            }
        }
    }
    ${fileFragment}
`
