import { ResultOf } from 'gql.tada';
import { getProductQuery } from "../../lib/vendure/queries/product";

export type VendureProductType = ResultOf<typeof getProductQuery>['product']