import { graphql } from '@/gql/graphql';
import activeOrderFragment from '../fragments/active-order';

export const addItemToOrder = graphql(`
  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ...active_order
    }
  }
`, [activeOrderFragment]);

export const createCartMutation = graphql(`
  query activeOrder {
    activeOrder {
      ...active_order
    }
  }
`, [activeOrderFragment]);

export const adjustOrderLineMutation = graphql(`
  mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ...active_order
    }
  }
`, [activeOrderFragment]);

export const removeOrderLineMutation = graphql(`
  mutation removeOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ...active_order
    }
  }
`, [activeOrderFragment]);
