import { graphql } from '@/gql/graphql';

export const authenticate = graphql(`
    mutation authenticate($input: AuthenticationInput!) {
        authenticate(input: $input) {
            ... on CurrentUser {
                __typename
                id
                identifier
            }
            ... on InvalidCredentialsError {
                __typename
                message
            }
            ... on NotVerifiedError {
                __typename
                message
            }
        }
    }
`);