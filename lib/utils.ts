import { ReadonlyURLSearchParams } from 'next/navigation';
import { ResultOf } from 'gql.tada';
import searchResultFragment from '@/lib/vendure/fragments/search-result';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ['VENDURE_API_ENDPOINT', 'VENDURE_INSTANCE'];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }
};

export const getSearchResultPrice = (item: ResultOf<typeof searchResultFragment>) => {
  return (
    item.priceWithTax.__typename === 'SinglePrice'
      ? item.priceWithTax.value
      : item.priceWithTax.__typename === 'PriceRange'
        ? item.priceWithTax.max
        : 0
  ).toFixed(2);
};

export type ItemOf<T extends Array<any>> = T extends (infer U)[] ? U : never;

export const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(amount / 100);
};
