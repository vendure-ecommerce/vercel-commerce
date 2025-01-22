import { PropsWithChildren } from 'react';
import { getActiveOrder } from '@/lib/vendure';
import { CheckoutSteps } from '@/components/checkout/step';

export default async function CheckoutLayout({ children }: PropsWithChildren) {
  const activeOrder = await getActiveOrder();

  return (
    <div className="mx-auto max-w-screen-lg">
      <CheckoutSteps />
      <div className="rounded-md border border-neutral-200 bg-white px-6 py-4">{children}</div>
    </div>
  );
}
