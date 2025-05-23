import { clsx, type ClassValue } from 'clsx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { SearchResultFragment } from './vendure/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getSearchResultPrice = (item: SearchResultFragment) => {
  return (
    item.priceWithTax.__typename === 'SinglePrice'
      ? item.priceWithTax.value
      : item.priceWithTax.__typename === 'PriceRange'
        ? item.priceWithTax.max
        : 0
  ).toFixed(2);
};
