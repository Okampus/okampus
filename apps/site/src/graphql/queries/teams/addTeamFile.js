import { fileFragment } from '@/graphql/fragments/fileFragment'
import gql from 'graphql-tag'

export const addTeamFile = gql`
    mutation addTeamFile($file: Upload!, $createFile: CreateTeamFileDto!) {
        addTeamFile(file: $file, createFile: $createFile) {
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
