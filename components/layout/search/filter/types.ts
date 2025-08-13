import { ResultOf } from 'gql.tada';
import { collectionFragment } from '../../../../lib/vendure/queries/collection';

export type FilterList = ResultOf<typeof collectionFragment>[];
export type FilterListItem = ResultOf<typeof collectionFragment> & { path: string };
