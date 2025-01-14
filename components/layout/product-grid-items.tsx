import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { GetCollectionProductsQuery, Product } from 'lib/vendure/types';
import Link from 'next/link';
import { getActiveChannel } from '../../lib/vendure';
import { useActiveChannel } from '../cart/channel-context';

export default function ProductGridItems({
  products,
  currencyCode
}: {
  products: GetCollectionProductsQuery['search']['items'];
  currencyCode: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.slug}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.productName}
              label={{
                title: product.productName,
                amount: (product.priceWithTax.__typename === 'SinglePrice'
                  ? product.priceWithTax.value
                  : product.priceWithTax.__typename === 'PriceRange'
                    ? product.priceWithTax.max
                    : 0
                ).toFixed(2),
                currencyCode
              }}
              src={product.productAsset?.preview || ''}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
