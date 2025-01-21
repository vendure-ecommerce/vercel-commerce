import { Facet_ValueFragment, FacetFragment } from '@/lib/vendure/types';
import FacetsFilterItem from './item';

export default function FacetsFilter({
  list,
  collectionFacetValues
}: {
  list: FacetFragment[];
  collectionFacetValues: Pick<Facet_ValueFragment, 'code' | 'name' | 'facetId' | 'id'>[];
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
