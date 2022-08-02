import gql from 'graphql-tag'

const names =
    'clubCount,clubEventCount,clubMembershipCount,clubUniqueMembershipCount,clubCreatedEventCount,userCount'

export const getAllMetrics = gql`
    query getAllMetrics($after: DateTime!, $before: DateTime!, $interval: String!) {
        metrics(metrics: { after: $after, before: $before, interval: $interval, names: "${names}" }) {
            name
            value
            createdAt
        }
    }
`
