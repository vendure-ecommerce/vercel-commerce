import FacetsFilterItem from './item';
import { ResultOf } from 'gql.tada';
import { facetFragment, facetValueFragment } from '@/lib/vendure/fragments/facet';

export default function FacetsFilter({
  list,
  collectionFacetValues
}: {
  list: ResultOf<typeof facetFragment>[];
  collectionFacetValues: ResultOf<typeof facetValueFragment>[];
}) {
  return (
    <div className="flex flex-wrap justify-start gap-4 md:items-center">
      {list
        .filter(
          (facet) =>
            collectionFacetValues.findIndex((facetValue) => facetValue.facetId == facet.id) > -1
        )
        .map((facet) => {
          return (
            <FacetsFilterItem
              item={facet}
              key={facet.id}
              collectionFacetValues={collectionFacetValues}
            ></FacetsFilterItem>
          );
        })}
    </div>
  );
}
