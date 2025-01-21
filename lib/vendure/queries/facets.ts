import gql from 'graphql-tag';
import { facetFragment } from '../fragments/facet';

export const getFacetsQuery = gql`
    query getFacets {
        facets(options: {take: 100}) {
            items {
                ...facet
            }
            totalItems
        }
    }
    ${facetFragment}
`;
