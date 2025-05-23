'use client';

import { cn } from '@/lib/utils';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { Product_Option_GroupFragment, VariantFragment } from 'lib/vendure/types';
type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  optionGroups,
  variants
}: {
  optionGroups: Array<Product_Option_GroupFragment>;
  variants: Array<VariantFragment>;
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !optionGroups.length || (optionGroups.length === 1 && optionGroups[0]?.options.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: true, // TODO: Stock level
    ...variant.options.reduce(
      (accumulator, option) => ({ ...accumulator, [option.group.code]: option.code }),
      {}
    )
  }));

  return optionGroups.map((optionGroup) => (
    <form key={optionGroup.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm tracking-wide uppercase">{optionGroup.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {optionGroup.options.map((value) => {
            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...state, [optionGroup.code]: value.code };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              optionGroups.find(
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
                className={cn(
                  'border-border flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-900',
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
