import gql from 'graphql-tag';

const searchResultFragment = gql`
    fragment searchResult on SearchResult {
        __typename
        sku
        slug
        productName
        description
        inStock
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
`;

export default searchResultFragment;
