import { GridTileImage } from 'components/grid/tile';
import { getActiveChannel, getCollectionProducts } from 'lib/vendure';
import Link from 'next/link';
import { useActiveChannel } from '../cart/channel-context';
import { getSearchResultPrice } from '../../lib/utils';
import { ResultOf } from 'gql.tada';
import searchResultFragment from '@/lib/vendure/fragments/search-result';

async function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: ResultOf<typeof searchResultFragment>;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  const activeChannel = await getActiveChannel();
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.slug}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.productAsset?.preview ?? ''}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.productName}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.productName as string,
            amount: getSearchResultPrice(item),
            currencyCode: activeChannel.defaultCurrencyCode
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts({
    collection: 'electronics'
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
