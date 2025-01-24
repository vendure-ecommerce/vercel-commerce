'use client';

import { getCheckoutSteps } from '@/lib/vendure/checkout';
import Link from 'next/link';
import { cn } from '@/ui-components/lib/utils';
import { usePathname } from 'next/navigation';
import { FaRegCircle, FaRegCircleCheck, FaRegCircleDot } from 'react-icons/fa6';

export function CheckoutSteps() {
  const pathname = usePathname();
  const checkoutSteps = getCheckoutSteps(pathname.split('/').pop());

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-blue-300"></div>
      <div className="flex items-center justify-between">
        {checkoutSteps.map((step) => {
          const stepPathname = `/checkout/${step.identifier}`;
          return (
            <Link
              key={`step-${step.identifier}`}
              href={stepPathname}
              className={cn({
                'z-10 flex items-center bg-neutral-50 p-4 first:ps-0 last:pe-0': true,
                'text-neutral-500': !step.active,
                'text-blue-600': step.done
              })}
            >
              {step.done && <FaRegCircleCheck />}
              {step.active && <FaRegCircleDot />}
              {!step.active && !step.done && <FaRegCircle />}
              <span className="ml-1">{step.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
