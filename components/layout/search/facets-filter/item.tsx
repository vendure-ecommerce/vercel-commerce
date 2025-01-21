'use client';

import { Facet_ValueFragment, FacetFragment } from '@/lib/vendure/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MultiSelect } from '@/ui-components/multi-select';
import { useMemo } from 'react';

export default function FacetsFilterItem({
  item,
  collectionFacetValues
}: {
  item: FacetFragment;
  collectionFacetValues: Pick<Facet_ValueFragment, 'code' | 'name' | 'id'>[];
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
