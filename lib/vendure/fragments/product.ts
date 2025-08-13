import { graphql } from '@/gql/graphql';
import assetFragment from './image';

export const variantFragment = graphql(`
  fragment variant on ProductVariant {
    id
    name
    options {
      group {
        id
        name
        code
      }
      name
      code
      id
    }
    currencyCode
    priceWithTax
    price
  }
`);

export const productOptionGroupFragment = graphql(`
  fragment product_option_group on ProductOptionGroup {
    id
    name
    code
    options {
      id
      name
      code
    }
  }
`);

const productFragment = graphql(
  `
    fragment product on Product {
      __typename
      id
      slug
      enabled
      name
      description
      optionGroups {
        ...product_option_group
      }
      variantList(options: { take: 100 }) {
        items {
          ...variant
        }
      }
      featuredAsset {
        ...image
      }
      assets {
        ...image
      }
      updatedAt
    }
  `,
  [assetFragment, variantFragment, productOptionGroupFragment]
);

export default productFragment;
