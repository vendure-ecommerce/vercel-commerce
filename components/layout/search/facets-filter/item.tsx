'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MultiSelect } from '@/ui-components/multi-select';
import { useMemo } from 'react';
import { ResultOf } from 'gql.tada';
import { facetFragment, facetValueFragment } from '@/lib/vendure/fragments/facet';
import { readFragment } from '@/gql/graphql';

export default function FacetsFilterItem({
  item,
  collectionFacetValues
}: {
  item: ResultOf<typeof facetFragment>;
  collectionFacetValues: ResultOf<typeof facetValueFragment>[];
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function onFilterChange(group: string, value: string[]) {
    const params = new URLSearchParams(searchParams);

    if (value.length > 0) {
      params.set(group, value.join(','));
    } else {
      params.delete(group);
    }

    replace(`${pathname}?${params.toString()}`);
  }

  const defaultValue = useMemo(() => {
    return searchParams.get(item.code)?.split(',') ?? [];
  }, [searchParams]);

  return (
    <div className="max-w-[50%] md:max-w-[250px] shrink-0 grow">
      <h3 className="mb-2 block text-xs text-neutral-500 dark:text-neutral-400">{item.name}</h3>
      <div>
        <MultiSelect
          defaultValue={defaultValue}
          options={item.values
            .map(valueFragment => readFragment(facetValueFragment, valueFragment))
            .filter(
              (itemValue) =>
                collectionFacetValues.findIndex((facetValue) => facetValue.id === itemValue.id) > -1
            )
            .map((itemValue) => ({
              label: itemValue.name,
              value: itemValue.id
            }))}
          onValueChange={(value) => onFilterChange(item.code, value)}
        />
      </div>
    </div>
  );
}
