import { getActiveCustomer } from 'lib/vendure';
import { redirect } from 'next/navigation';
import { AccountNavigation } from '@/components/account/navigation';
import { Navbar } from '@/components/layout/navbar';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const customer = await getActiveCustomer();

  if (!customer) {
    redirect('/sign-in');
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
            <AccountNavigation />
          </aside>
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </>
  );
}
