import { GetCollectionsQuery } from '../../../../lib/vendure/types';

export type FilterList = GetCollectionsQuery['collections']['items'];
export type FilterListItem = FilterList[0] & { path: string };
