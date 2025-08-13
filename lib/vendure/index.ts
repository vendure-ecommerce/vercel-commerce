import { TAGS } from 'lib/constants';
import { isVendureError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  collectionFragment,
  getCollectionFacetValuesQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getProductQuery, getProductsQuery } from './queries/product';
import {
  addItemToOrder,
  adjustOrderLineMutation,
  removeOrderLineMutation
} from './mutations/active-order';
import { DocumentNode, print } from 'graphql';
import { getActiveOrderQuery } from './queries/active-order';
import { getActiveChannelQuery } from './queries/active-channel';
import { getFacetsQuery } from './queries/facets';
import { facetFragment, facetValueFragment } from './fragments/facet';
import activeOrderFragment from './fragments/active-order';
import searchResultFragment from './fragments/search-result';
import { authenticate } from '@/lib/vendure/mutations/customer';
import { updateCustomerMutation } from '@/lib/vendure/mutations/update-customer';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  activeCustomerFragment,
  getActiveCustomerQuery
} from '@/lib/vendure/queries/active-customer';
import {
  getCustomerOrdersQuery,
  getOrderByCodeQuery
} from '@/lib/vendure/queries/customer-orders';
import orderFragment from '@/lib/vendure/fragments/order';
import { VariablesOf, ResultOf } from 'gql.tada';
import { readFragment } from '@/gql/graphql';
import activeChannelFragment from '@/lib/vendure/fragments/active-channel';
import productFragment from '@/lib/vendure/fragments/product';

const endpoint = process.env.VENDURE_API_ENDPOINT || 'http://localhost:3000/shop-api';

export async function vendureFetch<T, V extends Record<string, any> = Record<string, any>>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: DocumentNode | TypedDocumentNode<T, V> | string;
  tags?: string[];
  variables?: V;
}): Promise<{ status: number; body: T; headers: Headers } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query: typeof query === 'string' ? query : print(query) }),
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
  const res = await vendureFetch({
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
  const res = await vendureFetch({
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
  const res = await vendureFetch({
    query: removeOrderLineMutation,
    variables: {
      orderLineId
    },
    cache: 'no-store',
    headers: await getAuthHeaders()
  });

  return res.body.removeOrderLine;
}

export async function getActiveOrder(): Promise<ResultOf<typeof activeOrderFragment> | null> {
  const res = await vendureFetch({
    query: getActiveOrderQuery,
    tags: [TAGS.cart],
    headers: await getAuthHeaders()
  });

  return res.body.activeOrder ? readFragment(activeOrderFragment, res.body.activeOrder) : null;
}

export async function getActiveChannel(): Promise<ResultOf<typeof activeChannelFragment>> {
  const res = await vendureFetch({
    query: getActiveChannelQuery,
    tags: [TAGS.channel],
    headers: await getAuthHeaders()
  });

  return readFragment(activeChannelFragment, res.body.activeChannel);
}

export async function getCollection(handle: string): Promise<ResultOf<typeof collectionFragment> | null> {
  const res = await vendureFetch({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      slug: handle
    }
  });

  return res.body.collection ? readFragment(collectionFragment, res.body.collection) : null;
}

export async function getCollectionProducts({
  collection,
  sortKey,
  direction,
  facetValueFilters
}: {
  collection: string;
  sortKey?: string;
  direction?: 'ASC' | 'DESC';
  facetValueFilters?: VariablesOf<typeof getCollectionProductsQuery>['facetValueFilters'];
}): Promise<ResultOf<typeof searchResultFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      slug: collection,
      facetValueFilters,
      sortKey: {
        [sortKey || 'name']: direction || 'ASC'
      }
    }
  });

  return res.body.search.items.map(item => readFragment(searchResultFragment, item));
}

export async function getCollectionFacetValues({
  collection,
  sortKey,
  direction
}: {
  collection: string;
  sortKey?: string;
  direction?: 'ASC' | 'DESC';
}): Promise<ResultOf<typeof facetValueFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionFacetValuesQuery,
    tags: [TAGS.collections, TAGS.products, TAGS.facets],
    variables: {
      slug: collection,
      sortKey: {
        [sortKey || 'name']: direction || 'ASC'
      }
    }
  });

  return res.body.search.facetValues.map((item) => readFragment(facetValueFragment, item.facetValue));
}

export async function getCollections({
  topLevelOnly = false,
  parentId
}: {
  topLevelOnly?: boolean;
  parentId?: string;
} = {}): Promise<ResultOf<typeof collectionFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
    variables: {
      topLevelOnly,
      ...(parentId && { filter: { parentId: { eq: parentId } } })
    }
  });

  return res.body.collections.items.map(item => readFragment(collectionFragment, item));
}

export async function getFacets(): Promise<ResultOf<typeof facetFragment>[]> {
  const res = await vendureFetch({
    query: getFacetsQuery,
    tags: [TAGS.facets]
  });

  return res.body.facets.items.map(item => readFragment(facetFragment, item));
}

export async function getMenu(): Promise<ResultOf<typeof collectionFragment>[]> {
  const res = await vendureFetch({
    query: getMenuQuery,
    tags: [TAGS.collections]
  });

  return res.body.collections.items.map(item => readFragment(collectionFragment, item));
}

export async function getProduct(handle: string) {
  const res = await vendureFetch({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      slug: handle
    }
  });

  return readFragment(productFragment, res.body.product);
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
  const res = await vendureFetch({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      sortKey: {
        [sortKey || 'name']: direction || 'ASC'
      }
    }
  });

  return res.body.search.items.map(item => readFragment(searchResultFragment, item));
}

export async function authenticateCustomer(username: string, password: string) {
  const res = await vendureFetch({
    query: authenticate,
    tags: [TAGS.customer],
    variables: {
      input: {
        native: {
          username,
          password
        }
      }
    }
  });

  await updateAuthCookie(res.headers);

  return res.body.authenticate;
}

export async function getActiveCustomer() {
  const res = await vendureFetch({
    query: getActiveCustomerQuery,
    tags: [TAGS.customer],
    headers: await getAuthHeaders()
  });

  return readFragment(activeCustomerFragment, res.body.activeCustomer);
}

export async function getCustomerOrders(options?: VariablesOf<typeof getCustomerOrdersQuery>['options']) {
  const res = await vendureFetch({
    query: getCustomerOrdersQuery,
    tags: [TAGS.customer],
    variables: { options },
    headers: await getAuthHeaders()
  });

  return res.body.activeCustomer?.orders;
}

export async function getOrderByCode(code: string) {
  const res = await vendureFetch({
    query: getOrderByCodeQuery,
    tags: [TAGS.customer],
    variables: { code },
    headers: await getAuthHeaders()
  });

  return res.body.orderByCode ? readFragment(orderFragment, res.body.orderByCode) : null;
}

export async function updateCustomer(input: VariablesOf<typeof updateCustomerMutation>['input']) {
  const res = await vendureFetch({
    query: updateCustomerMutation,
    cache: 'no-store',
    variables: { input },
    headers: await getAuthHeaders()
  });

  return readFragment(activeCustomerFragment, res.body.updateCustomer);
}

export async function getPage(slug: string) {
  // TODO: Implement with custom entity
  return undefined;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  // TODO: Implement webhooks in Vendure repo
  const topic = 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.VENDURE_REVALIDATION_SECRET) {
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
