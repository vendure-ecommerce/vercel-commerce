import { createUrl } from '@/lib/utils';
import { DeleteItemButton } from '@/components/cart/delete-item-button';
import Image from 'next/image';
import Link from 'next/link';
import Price from '@/components/price';
import { EditItemQuantityButton } from '@/components/cart/edit-item-quantity-button';
import { ResultOf } from 'gql.tada';
import activeOrderFragment from '@/lib/vendure/fragments/active-order';
import { readFragment } from '@/gql/graphql';
import productFragment from '@/lib/vendure/fragments/product';
import assetFragment from '@/lib/vendure/fragments/image';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export function CartItem({
  cart,
  item,
  closeCart
}: {
  cart: ResultOf<typeof activeOrderFragment>;
  item: ResultOf<typeof activeOrderFragment>['lines'][number];
  closeCart: () => void;
}) {
  const merchandiseSearchParams = {} as MerchandiseSearchParams;
  const product = readFragment(productFragment, item.productVariant.product);
  const featuredAsset = readFragment(assetFragment, product.featuredAsset);

  item.productVariant.options.forEach((option) => {
    merchandiseSearchParams[option.group.code] = option.code;
  });

  const merchandiseUrl = createUrl(
    `/product/${product.slug}`,
    new URLSearchParams(merchandiseSearchParams)
  );

  return (
    <li className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
      <div className="relative flex w-full flex-row justify-between px-1 py-4">
        <div className="absolute z-40 -mt-2 -ml-1">
          <DeleteItemButton item={item} />
        </div>
        <div className="flex flex-row">
          {featuredAsset && (
            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
              <Image
                className="h-full w-full object-cover"
                width={64}
                height={64}
                alt={item.productVariant.name}
                src={featuredAsset?.preview}
              />
            </div>
          )}
          <Link
            href={merchandiseUrl}
            onClick={closeCart}
            className="z-30 ml-2 flex flex-row space-x-4"
          >
            <div className="flex flex-1 flex-col text-base">
              <span className="leading-tight">{product.name}</span>
              {product.optionGroups.length > 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {item.productVariant.options.map((option) => option.name).join(', ')}
                </p>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="flex h-16 flex-col justify-between">
          <Price
            className="flex justify-end space-y-2 text-right text-sm"
            amount={item.linePriceWithTax}
            currencyCode={cart.currencyCode}
          />
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <EditItemQuantityButton item={item} type="minus" />
            <p className="w-6 text-center">
              <span className="w-full text-sm">{item.quantity}</span>
            </p>
            <EditItemQuantityButton item={item} type="plus" />
          </div>
        </div>
      </div>
    </li>
  );
}
