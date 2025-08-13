import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getActiveCustomer, getMenu } from 'lib/vendure';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import OpenSignIn from '@/components/account/open-sign-in';
import { UserDropdown } from '@/components/account/user-dropdown';
import { readFragment } from '@/gql/graphql';
import { collectionFragment } from '@/lib/vendure/queries/collection';

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu();
  const activeCustomer = await getActiveCustomer();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu
                .map((data) => readFragment(collectionFragment, data))
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/search/${item.slug}`}
                      prefetch={true}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end gap-2 md:w-1/3">
          {activeCustomer ? <UserDropdown customer={activeCustomer} /> : <OpenSignIn />}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
