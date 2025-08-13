import { graphql } from '@/gql/graphql';
import { activeCustomerFragment } from '../queries/active-customer';

export const updateCustomerMutation = graphql(`
  mutation updateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      ...active_customer
    }
  }
`, [activeCustomerFragment]);