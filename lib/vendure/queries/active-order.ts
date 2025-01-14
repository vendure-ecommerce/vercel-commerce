import activeOrderFragment from '../fragments/active-order';
import gql from "graphql-tag";

export const getActiveOrderQuery = gql`
  query getActiveOrder {
    activeOrder {
      ...active_order
    }
  }
  ${activeOrderFragment}
`;
