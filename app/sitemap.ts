import { getCollections, getProducts } from 'lib/vendure';
import { validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';
import { readFragment } from '@/gql/graphql';
import productFragment from '@/lib/vendure/fragments/product';
import searchResultFragment from '@/lib/vendure/fragments/search-result';
import { collectionFragment } from '@/lib/vendure/queries/collection';

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections
      .map((data) => readFragment(collectionFragment, data))
      .map((collection) => ({
        url: `${baseUrl}/search/${collection.slug}`,
        lastModified: collection.updatedAt
      }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products
      .map((data) => readFragment(searchResultFragment, data))
      .map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date().toISOString()
      }))
  );

  // const pagesPromise = getPages().then((pages) =>
  //   pages.map((page) => ({
  //     url: `${baseUrl}/${page.handle}`,
  //     lastModified: page.updatedAt
  //   }))
  // );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
