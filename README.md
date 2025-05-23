TODO: Update deployment link to point to the correct repository
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcommerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&demo-url=https%3A%2F%2Fdemo.vercel.store&demo-image=https%3A%2F%2Fbigcommerce-demo-asset-ksvtgfvnd.vercel.app%2Fbigcommerce.png&env=COMPANY_NAME,SHOPIFY_REVALIDATION_SECRET,SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SITE_NAME,TWITTER_CREATOR,TWITTER_SITE)

# Vendure x Next.js Commerce

A Next.js 15 and App Router-ready ecommerce template, built with [Vendure](https://vendure.io), featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS and shadcn/ui
- Automatic light/dark mode based on system settings

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View
> the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store),
> and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's
recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for
this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Vendure
> instance
> store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
