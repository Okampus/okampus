import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const createReport = gql`
    mutation createReport($id: Int!, $report: CreateReportDto!) {
        createReport(id: $id, report: $report) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`
