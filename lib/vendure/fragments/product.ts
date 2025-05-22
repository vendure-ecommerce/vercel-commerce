import gql from 'graphql-tag';
import assetFragment from './image';

const variantFragment = gql`
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
`;

const productOptionGroupFragment = gql`
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
`;

const productFragment = gql`
  fragment product on Product {
    __typename
    id
    slug
    enabled
    name
    description
    # Remove priceRange field
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
  ${assetFragment}
  ${variantFragment}
  ${productOptionGroupFragment}
`;

export default productFragment;
