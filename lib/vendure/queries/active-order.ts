import { graphql } from '@/gql/graphql';
import activeOrderFragment from '../fragments/active-order';

export const getActiveOrderQuery = graphql(`
  query getActiveOrder {
    activeOrder {
      ...active_order
    }
  }
`, [activeOrderFragment]);
