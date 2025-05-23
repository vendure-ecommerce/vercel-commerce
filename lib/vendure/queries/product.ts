import gql from "graphql-tag";
import productFragment from '../fragments/product';
import searchResultFragment from "../fragments/search-result";

export const getProductQuery = gql`
  query getProduct($slug: String!) {
    product(slug: $slug) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = gql`
    query getProducts($sortKey: SearchResultSortParameter, $query: String) {
        search(input: { take: 100, sort: $sortKey, term: $query, groupByProduct: true}) {
            items {
                ...searchResult
            }
            totalItems
        }
    }
    ${searchResultFragment}
`;

// TODO: needs extension in Vendure
// export const getProductRecommendationsQuery = /* GraphQL */ `
//   query getProductRecommendations($productId: ID!) {
//     productRecommendations(productId: $productId) {
//       ...product
//     }
//   }
//   ${productFragment}
// `;
