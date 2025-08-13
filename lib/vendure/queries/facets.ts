import { graphql } from '@/gql/graphql';
import { facetFragment } from '../fragments/facet';

export const getFacetsQuery = graphql(`
    query getFacets {
        facets(options: {take: 100}) {
            items {
                ...facet
            }
            totalItems
        }
    }
`, [facetFragment]);
