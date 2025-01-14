import gql from 'graphql-tag';
import searchResultFragment from '../fragments/search-result';

const collectionFragment = gql`
    fragment collection on Collection {
        id
        slug
        name
        description
        updatedAt
        parentId
        customFields {
            seoTitle
            seoDescription
        }
    }
`;

export const getCollectionQuery = gql`
  query getCollection($slug: String!) {
    collection(slug: $slug) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = gql`
    query getCollections($topLevelOnly: Boolean, $filter: CollectionFilterParameter) {
        collections(options: { topLevelOnly: $topLevelOnly, filter: $filter, take: 100, sort: { name: DESC } }) {
            items {
                ...collection
            }
        }
    }
    ${collectionFragment}
`;

export const getCollectionProductsQuery = gql`
  query getCollectionProducts($slug: String!, $sortKey: SearchResultSortParameter) {
    search(input: { groupByProduct: true, collectionSlug: $slug, sort: $sortKey }) {
      items {
        ...searchResult
      }
      totalItems
    }
  }
  ${searchResultFragment}
`;
