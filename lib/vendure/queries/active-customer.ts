import gql from 'graphql-tag';

export const activeCustomerFragment = gql`
  fragment active_customer on Customer {
    id
    firstName
    lastName
    emailAddress
  }
`;

export const getActiveCustomerQuery = gql`
  query getActiveCustomer {
    activeCustomer {
      ...active_customer
    }
  }
  ${activeCustomerFragment}
`;
