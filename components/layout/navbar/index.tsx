import OpenSignIn from '@/components/account/open-sign-in';
import { UserDropdown } from '@/components/account/user-dropdown';
import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getActiveCustomer, getMenu } from 'lib/vendure';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu();
  const activeCustomer = await getActiveCustomer();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="flex w-full items-center justify-between">
        {/* Left section - Logo and Menu */}
        <div className="flex min-w-0 flex-1 items-center md:w-auto md:flex-none">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 hidden flex-none text-sm font-medium uppercase lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/search/${item.slug}`}
                    prefetch={true}
                    className="whitespace-nowrap text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex md:max-w-md md:flex-1 md:justify-center md:px-4 lg:max-w-lg">
          <div className="w-full">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
        </div>

        <div className="mr-2 block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        {/* Right section - User actions */}
        <div className="flex items-center justify-end gap-2 md:flex-none">
          {activeCustomer ? <UserDropdown customer={activeCustomer} /> : <OpenSignIn />}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
