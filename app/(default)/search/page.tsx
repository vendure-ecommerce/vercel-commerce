import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getActiveChannel, getProducts } from 'lib/vendure';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, direction } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, direction, query: searchValue });
  const resultsText = products.length > 1 ? 'results' : 'result';
  const activeChannel = await getActiveChannel();

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems currencyCode={activeChannel.defaultCurrencyCode} products={products} />
        </Grid>
      ) : null}
    </>
  );
}
