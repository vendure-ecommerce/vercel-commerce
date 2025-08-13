export const AUTH_COOKIE_KEY = 'vendure-auth-token'



export type SortFilterItem = {
  name: string;
  slug: string | null;
  sortKey: 'name' | 'price';
  direction: 'ASC' | 'DESC';
};

export const defaultSort: SortFilterItem = {
  name: 'Name: A to Z',
  slug: 'name-a-z',
  sortKey: 'name',
  direction: 'ASC'
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    name: 'Name: Z to A',
    slug: 'name-z-a',
    sortKey: 'name',
    direction: 'DESC'
  },
  { name: 'Price: Low to high', slug: 'price-asc', sortKey: 'price', direction: 'ASC' }, // asc
  { name: 'Price: High to low', slug: 'price-desc', sortKey: 'price', direction: 'DESC' }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
  channel: 'channel',
  facets: 'facets',
  customer: 'customer'
};
