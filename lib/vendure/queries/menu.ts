import { graphql } from '@/gql/graphql';
import { collectionFragment } from '@/lib/vendure/queries/collection';

/**
 * @description
 * Fetches the top-level collections
 */
export const getMenuQuery = graphql(
  `
    query collections {
      collections(options: { take: 100, filter: { parentId: { eq: "1" } } }) {
        items {
          ...collection
        }
      }
    }
  `,
  [collectionFragment]
);
