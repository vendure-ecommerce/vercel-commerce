import { getActiveChannel, getCollectionProducts } from 'lib/vendure';
import Link from 'next/link';
import { getSearchResultPrice } from '../lib/utils';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  const activeChannel = await getActiveChannel();

  /** You can create a custom collection in Vendure to display products on the homepage or you can pass any collection that you want to display. */
  const products = await getCollectionProducts({ collection: 'sports-outdoor' });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
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
