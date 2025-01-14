import gql from "graphql-tag";
import assetFragment from "./image";

const productFragment = gql`
    fragment product on Product {
        __typename
        id
        slug
        enabled
        name
        description
        optionGroups {
            id
            name
            code
            options {
                id
                name
                code
            }
        }
        variantList(options: { take: 100 }) {
            items {
                id
                name
                options {
                    group {
                        id
                        name
                        code
                    }
                    name
                    code
                    id
                }
                currencyCode
                priceWithTax
                price
            }
        }
        featuredAsset {
            ...image
        }
        assets{
            ...image
        }
        updatedAt
    }
    ${assetFragment}
`;

export default productFragment;
