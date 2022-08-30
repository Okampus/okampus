import gql from 'graphql-tag'

const names =
    'ClubCount,ClubEventCount,ClubMembershipCount,ClubUniqueMembershipCount,ClubCreatedEventCount,UserCount'

export const getAllMetrics = gql`
    query getAllMetrics($after: DateTime!, $before: DateTime!, $interval: String!) {
        metrics(metrics: { after: $after, before: $before, interval: $interval, names: "${names}" }) {
            name
            value
            createdAt
        }
    }
`
