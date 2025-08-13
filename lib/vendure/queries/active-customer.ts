import { graphql } from '@/gql/graphql';

export const activeCustomerFragment = graphql(`
  fragment active_customer on Customer {
    id
    firstName
    lastName
    emailAddress
  }
`);

export const getActiveCustomerQuery = graphql(`
  query getActiveCustomer {
    activeCustomer {
      ...active_customer
    }
  }
`, [activeCustomerFragment]);
