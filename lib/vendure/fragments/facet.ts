import { graphql } from "@/gql/graphql";

export const facetValueFragment = graphql(`
    fragment facet_value on FacetValue {
        name
        code
        id
        facetId
    }
`);

export const facetFragment = graphql(`
    fragment facet on Facet {
        id
        name
        code
        values {
            ...facet_value
        }
    }
`, [facetValueFragment]);