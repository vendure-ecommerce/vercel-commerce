import { graphql } from '@/gql/graphql';
import productFragment from './product';

export const orderAddressFragment = graphql(`
  fragment OrderAddress on OrderAddress {
    fullName
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    phoneNumber
  }
`);

export const orderFragment = graphql(`
  fragment Order on Order {
    id
    code
    state
    active
    createdAt
    updatedAt
    currencyCode
    total
    totalWithTax
    subTotal
    subTotalWithTax
    shipping
    shippingWithTax
    totalQuantity
    lines {
      id
      quantity
      linePrice
      linePriceWithTax
      unitPrice
      unitPriceWithTax
      productVariant {
        id
        name
        sku
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
    billingAddress {
      ...OrderAddress
    }
    shippingAddress {
      ...OrderAddress
    }
  }
`, [productFragment, orderAddressFragment]);

export default orderFragment;