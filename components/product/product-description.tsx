import { getActiveChannel } from '@/lib/vendure';
import { AddToCart } from 'components/cart/add-to-cart';
import Prose from 'components/prose';
import { ProductFragment } from 'lib/vendure/types';
import Price from '../price';
import { VariantSelector } from './variant-selector';

export async function ProductDescription({ product }: { product: ProductFragment }) {
  /**
   *  To use this you need to vercel-commerce plugin
   *  @see https://github.com/vendure-ecommerce/vendure-vercel-commerce/tree/main/src/plugins/vercel-commerce
   *
   * */

  const fromPrice = product.priceRange.min;

  const activeChannel = await getActiveChannel();

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product?.name}</h1>
        {fromPrice && (
          <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
            <Price amount={fromPrice} currencyCode={activeChannel.defaultCurrencyCode} />
          </div>
        )}
      </div>
      <VariantSelector
        optionGroups={product?.optionGroups ?? []}
        variants={product?.variantList.items ?? []}
      />
      {product?.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
