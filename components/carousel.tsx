import { getActiveChannel, getCollectionProducts } from 'lib/vendure';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { getSearchResultPrice } from '../lib/utils';
import { readFragment } from '@/gql/graphql';
import searchResultFragment from '@/lib/vendure/fragments/search-result';

export async function Carousel() {
  const activeChannel = await getActiveChannel();
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = await getCollectionProducts({ collection: 'homepage-carousel' });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pt-1 pb-6">
      <ul className="animate-carousel flex gap-4">
        {carouselProducts
          .map((data) => readFragment(searchResultFragment, data))
          .map((product, i) => (
            <li
              key={`${product.slug}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link href={`/product/${product.slug}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.productName}
                  label={{
                    title: product.productName,
                    amount: getSearchResultPrice(product),
                    currencyCode: activeChannel.defaultCurrencyCode
                  }}
                  src={product.productAsset?.preview ?? ''}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
