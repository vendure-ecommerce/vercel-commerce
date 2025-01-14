import { TAGS } from 'lib/constants';
import { isVendureError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getProductQuery, getProductsQuery } from './queries/product';
import {
  ActiveOrderQuery,
  AddItemToOrderMutation,
  AddItemToOrderMutationVariables,
  AdjustOrderLineMutation,
  AdjustOrderLineMutationVariables,
  CollectionsQuery,
  GetActiveChannelQuery,
  GetCollectionProductsQuery,
  GetCollectionProductsQueryVariables,
  GetCollectionQuery,
  GetCollectionQueryVariables,
  GetProductQuery,
  GetProductQueryVariables,
  GetProductsQuery,
  GetProductsQueryVariables,
  RemoveOrderLineMutation,
  RemoveOrderLineMutationVariables
} from './types';
import {
  addItemToOrder,
  adjustOrderLineMutation,
  removeOrderLineMutation
} from './mutations/active-order';
import { DocumentNode } from 'graphql';
import { getActiveOrderQuery } from './queries/active-order';
import { getActiveChannelQuery } from './queries/active-channel';

const endpoint = process.env.VENDURE_ENDPOINT || 'http://localhost:3000/shop-api';

export async function vendureFetch<T, TVariables = unknown>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string | DocumentNode;
  tags?: string[];
  variables?: TVariables;
}): Promise<{ status: number; body: T; headers: Headers } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query: typeof query === 'string' ? query : query.loc?.source.body }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body: body.data,
      headers: result.headers
    };
  } catch (e) {
    console.log({ e });
    if (isVendureError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

async function getAuthHeaders() {
  const tokenValue = (await cookies()).get('vendure-token')?.value;
  return tokenValue
    ? {
        Authorization: 'Bearer ' + tokenValue
      }
    : undefined;
}

async function updateAuthCookie(headers: Headers) {
  const cookieStore = await cookies();
  const tokenValue = headers.get('vendure-auth-token');

  if (tokenValue && tokenValue != '') {
    cookieStore.set('vendure-token', tokenValue);
  }
}

export async function addToCart(productVariantId: string, quantity: number) {
  const res = await vendureFetch<AddItemToOrderMutation, AddItemToOrderMutationVariables>({
    query: addItemToOrder,
    variables: {
      productVariantId,
      quantity
    },
    cache: 'no-store',
    headers: await getAuthHeaders()
  });

  await updateAuthCookie(res.headers);

  return res.body.addItemToOrder;
}

export async function adjustCartItem(orderLineId: string, quantity: number) {
  const res = await vendureFetch<AdjustOrderLineMutation, AdjustOrderLineMutationVariables>({
    query: adjustOrderLineMutation,
    variables: {
      orderLineId,
      quantity
    },
    cache: 'no-store',
    headers: await getAuthHeaders()
  });

  return res.body.adjustOrderLine;
}

export async function removeFromCart(orderLineId: string) {
  const res = await vendureFetch<RemoveOrderLineMutation, RemoveOrderLineMutationVariables>({
    query: removeOrderLineMutation,
    variables: {
      orderLineId
    },
    cache: 'no-store',
    headers: await getAuthHeaders()
  });

  return res.body.removeOrderLine;
}

export async function getActiveOrder() {
  const res = await vendureFetch<ActiveOrderQuery>({
    query: getActiveOrderQuery,
    tags: [TAGS.cart],
    headers: await getAuthHeaders()
  });

  return res.body.activeOrder;
}

export async function getActiveChannel() {
  const res = await vendureFetch<GetActiveChannelQuery>({
    query: getActiveChannelQuery,
    tags: [TAGS.channel],
    headers: await getAuthHeaders()
  });

  return res.body.activeChannel;
}

export async function getCollection(handle: string) {
  const res = await vendureFetch<GetCollectionQuery, GetCollectionQueryVariables>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      slug: handle
    }
  });

  return res.body.collection;
}

export async function getCollectionProducts({
  collection,
  sortKey,
  direction
}: {
  collection: string;
  sortKey?: string;
  direction?: 'ASC' | 'DESC';
}) {
  const res = await vendureFetch<GetCollectionProductsQuery, GetCollectionProductsQueryVariables>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      slug: collection,
      sortKey: {
        [sortKey || 'name']: direction || 'ASC'
      }
    }
  });

  return res.body.search.items;
}

export async function getCollections({
  topLevelOnly = false,
  parentId
}: {
  topLevelOnly?: boolean;
  parentId?: string;
} = {}) {
  const res = await vendureFetch<CollectionsQuery>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
    variables: {
      topLevelOnly,
      ...(parentId && { filter: { parent: { eq: parentId } } })
    }
  });

  return res.body.collections.items.map((item) => ({
    ...item,
    path: `/search/${item.slug}`
  }));
}

export async function getMenu() {
  const res = await vendureFetch<CollectionsQuery>({
    query: getMenuQuery,
    tags: [TAGS.collections]
  });

  return res.body.collections.items;
}

export async function getProduct(handle: string) {
  const res = await vendureFetch<GetProductQuery, GetProductQueryVariables>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      slug: handle
    }
  });

  return res.body.product;
}

export async function getProducts({
  query,
  direction,
  sortKey
}: {
  query?: string;
  direction?: string;
  sortKey?: string;
}) {
  const res = await vendureFetch<GetProductsQuery, GetProductsQueryVariables>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      sortKey: {
        [sortKey || 'name']: direction || 'ASC'
      }
    }
  });

  return res.body.search.items;
}

export async function getPage(slug: string){
  // TODO: Implement with custom entity
  return undefined;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
