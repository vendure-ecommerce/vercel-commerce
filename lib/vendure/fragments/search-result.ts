import { graphql } from '@/gql/graphql';

const searchResultFragment = graphql(`
  fragment searchResult on SearchResult {
    sku
    slug
    productName
    description
    productAsset {
      id
      preview
    }
    priceWithTax {
      __typename
      ... on SinglePrice {
        value
      }
      ... on PriceRange {
        min
        max
      }
    }
  }
`);

export default searchResultFragment;
