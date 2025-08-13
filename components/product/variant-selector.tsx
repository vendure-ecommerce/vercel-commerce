'use client';

import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { FragmentOf } from 'gql.tada';
import { variantFragment, productOptionGroupFragment } from '@/lib/vendure/fragments/product';
import { readFragment } from '@/gql/graphql';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  optionGroups,
  variants
}: {
  optionGroups: Array<FragmentOf<typeof productOptionGroupFragment>>;
  variants: Array<FragmentOf<typeof variantFragment>>;
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const processedOptionGroups = optionGroups.map((groupFrag) =>
    readFragment(productOptionGroupFragment, groupFrag)
  );

  const hasNoOptionsOrJustOneOption =
    !processedOptionGroups.length ||
    (processedOptionGroups.length === 1 && processedOptionGroups[0]?.options.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variantFrag) => {
    const variant = readFragment(variantFragment, variantFrag);
    return {
      id: variant.id,
      availableForSale: true, // TODO: Stock level
      ...variant.options.reduce(
        (accumulator, option) => ({ ...accumulator, [option.group.code]: option.code }),
        {}
      )
    };
  });

  return processedOptionGroups.map((optionGroup) => (
    <form key={optionGroup.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm tracking-wide uppercase">{optionGroup.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {optionGroup.options.map((value) => {
            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...state, [optionGroup.code]: value.code };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              optionGroups
                .map((data) => readFragment(productOptionGroupFragment, data))
                .find(
                  (option) =>
                    option.code === key && option.options.findIndex((o) => o.code === value) !== -1
                )
            );

            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the selected options.
            const isActive = state[optionGroup.code] === value.code;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionGroup.code, value.code);
                  updateURL(newState);
                }}
                key={value.code}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${optionGroup.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                  {
                    'cursor-default ring-2 ring-blue-600': isActive,
                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600':
                      !isActive && isAvailableForSale,
                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                      !isAvailableForSale
                  }
                )}
              >
                {value.name}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
