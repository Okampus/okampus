import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const report = gql`
    mutation report($id: Int!, $report: CreateReportDto!) {
        reportContent(id: $id, report: $report) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`
