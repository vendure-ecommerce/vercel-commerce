import activeOrderFragment from '../fragments/active-order';
import gql from 'graphql-tag';

export const addItemToOrder = gql`
  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ...active_order
    }
  }
  ${activeOrderFragment}
`;

export const createCartMutation = gql`
  query activeOrder {
    activeOrder {
      ...active_order
    }
  }
  ${activeOrderFragment}
`;

export const adjustOrderLineMutation = gql`
  mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ...active_order
    }
  }
  ${activeOrderFragment}
`;

export const removeOrderLineMutation = gql`
  mutation removeOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ...active_order
    }
  }
  ${activeOrderFragment}
`;
