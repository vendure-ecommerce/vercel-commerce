import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import { getSearchResultPrice } from '../../lib/utils';
import { ResultOf } from 'gql.tada';
import searchResultFragment from '@/lib/vendure/fragments/search-result';

export default function ProductGridItems({
  products,
  currencyCode
}: {
  products: ResultOf<typeof searchResultFragment>[];
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
                amount: getSearchResultPrice(product),
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
