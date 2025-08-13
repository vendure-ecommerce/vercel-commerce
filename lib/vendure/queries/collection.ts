import { graphql } from '@/gql/graphql';
import searchResultFragment from '../fragments/search-result';
import { facetValueFragment } from '../fragments/facet';

export const collectionFragment = graphql(`
  fragment collection on Collection {
    id
    slug
    name
    description
    updatedAt
    parentId
  }
`);

export const getCollectionQuery = graphql(
  `
    query getCollection($slug: String!) {
      collection(slug: $slug) {
        ...collection
      }
    }
  `,
  [collectionFragment]
);

export const getCollectionsQuery = graphql(
  `
    query getCollections($topLevelOnly: Boolean, $filter: CollectionFilterParameter) {
      collections(
        options: { topLevelOnly: $topLevelOnly, filter: $filter, take: 100, sort: { name: DESC } }
      ) {
        items {
          ...collection
        }
      }
    }
  `,
  [collectionFragment]
);

export const getCollectionProductsQuery = graphql(
  `
    query getCollectionProducts(
      $slug: String!
      $sortKey: SearchResultSortParameter
      $facetValueFilters: [FacetValueFilterInput!]
    ) {
      search(
        input: {
          groupByProduct: true
          collectionSlug: $slug
          sort: $sortKey
          facetValueFilters: $facetValueFilters
        }
      ) {
        items {
          ...searchResult
        }
        totalItems
      }
    }
  `,
  [searchResultFragment]
);

export const getCollectionFacetValuesQuery = graphql(
  `
    query getCollectionFacetValues($slug: String!, $sortKey: SearchResultSortParameter) {
      search(input: { groupByProduct: true, collectionSlug: $slug, sort: $sortKey }) {
        facetValues {
          facetValue {
            ...facet_value
          }
        }
      }
    }
  `,
  [facetValueFragment]
);
