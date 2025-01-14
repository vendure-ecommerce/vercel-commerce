import productFragment from './product';
import gql from "graphql-tag";

const activeOrderFragment = gql`
    fragment active_order on Order {
        id
        subTotal
        subTotalWithTax
        currencyCode
        totalWithTax
        total
        lines {
            id
            quantity
            linePriceWithTax
            productVariant {
                ... on ProductVariant {
                    id
                    name
                    options {
                        code
                        name
                        group {
                            code
                            name
                        }
                    }
                    product {
                        ...product
                    }
                }
            }
        }
        totalQuantity
    }
    ${productFragment}
`;

export default activeOrderFragment;
