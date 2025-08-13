import { graphql } from '@/gql/graphql';
import productFragment from './product';

const orderAddressFragment = graphql(`
  fragment OrderAddress on OrderAddress {
    fullName
  }
`);

const activeOrderFragment = graphql(
  `
    fragment active_order on Order {
      id
      subTotal
      subTotalWithTax
      currencyCode
      totalWithTax
      total
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          ... on ProductVariant {
            id
            name
            options {
              code
              name
              group {
                code
                name
              }
            }
            product {
              ...product
            }
          }
        }
      }
      totalQuantity
      billingAddress {
        ...OrderAddress
      }
      shippingAddress {
        ...OrderAddress
      }
    }
  `,
  [productFragment, orderAddressFragment]
);

export default activeOrderFragment;
