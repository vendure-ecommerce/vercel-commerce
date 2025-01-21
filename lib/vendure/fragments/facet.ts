import gql from "graphql-tag";

export const facetValueFragment = gql`
    fragment facet_value on FacetValue {
        name
        code
        id
        facetId
    }
`

export const facetFragment = gql`
    fragment facet on Facet {
        id
        name
        code
        values {
            ...facet_value
        }
    }
    ${facetValueFragment}
`