import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import { getActiveChannel, getProduct } from 'lib/vendure';
import Link from 'next/link';
import { Suspense } from 'react';
import { readFragment } from '@/gql/graphql';
import assetFragment from '@/lib/vendure/fragments/image';
import productFragment from '@/lib/vendure/fragments/product';
import { ResultOf } from 'gql.tada';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { source, width, height } = readFragment(assetFragment, product.featuredAsset) || {};
  const indexable = product.enabled;

  return {
    title: product.name,
    description: product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: source
      ? {
          images: [
            {
              url: source,
              width,
              height
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);
  const activeChannel = await getActiveChannel();

  const featuredAsset = readFragment(assetFragment, product?.featuredAsset);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: featuredAsset?.source,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.enabled
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: activeChannel.defaultCurrencyCode
      // TODO: needs client helper or schema extension in Vendure
      // highPrice: product.priceRange.maxVariantPrice.amount,
      // lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.assets
                  .slice(0, 5)
                  .map((data) => readFragment(assetFragment, data))
                  .map((asset) => ({
                    src: asset.source,
                    altText: product.name
                  }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
        {/*<RelatedProducts id={product.id} />*/}
      </div>
      <Footer />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts: Array<ResultOf<typeof productFragment>> = [];

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => {
          const featuredAsset = readFragment(assetFragment, product.featuredAsset);
          return (
            <li
              key={product.slug}
              className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <Link
                className="relative h-full w-full"
                href={`/product/${product.slug}`}
                prefetch={true}
              >
                <GridTileImage
                  alt={product.name}
                  label={{
                    title: product.name,
                    amount: '0',
                    currencyCode: 'USD'
                  }}
                  src={featuredAsset?.preview ?? ''}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
