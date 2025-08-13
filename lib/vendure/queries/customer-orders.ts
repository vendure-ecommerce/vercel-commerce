import { graphql } from '@/gql/graphql';
import orderFragment from '../fragments/order';

export const getCustomerOrdersQuery = graphql(`
  query getCustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        items {
          ...Order
        }
        totalItems
      }
    }
  }
`, [orderFragment]);

export const getOrderByCodeQuery = graphql(`
  query getOrderByCode($code: String!) {
    orderByCode(code: $code) {
      ...Order
    }
  }
`, [orderFragment]);