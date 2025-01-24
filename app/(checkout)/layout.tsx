import { PropsWithChildren } from 'react';
import Link from 'next/link';
import LogoSquare from '@/components/logo-square';

const { SITE_NAME } = process.env;

export default async function CheckoutLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <header className="relative flex items-center justify-between p-4 lg:px-6">
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
          <div>
              Support Actions
          </div>
      </header>
      <div className="mt-20 grid grid-cols-[1fr_400px]">
        <div>{children}</div>
        <div>cart</div>
      </div>
    </div>
  );
}
