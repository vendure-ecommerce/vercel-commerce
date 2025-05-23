import { validateEnvironmentVariables } from 'lib/utils';
import { getCollections, getPages, getProducts } from 'lib/vendure';
import { MetadataRoute } from 'next';

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
    collections.map((collection) => ({
      url: `${baseUrl}${collection.slug}`,
      lastModified: collection.updatedAt
    }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date().toISOString() //TODO: Implement lastModified for products
    }))
  );

  //TODO: Implement getPages function
  const pagesPromise = getPages().then((pages) => {
    // Handle null return from getPages
    if (!pages) return [];
    
    return pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt
    }));
  });

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise, pagesPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
