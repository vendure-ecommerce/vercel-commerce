'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/ui-components/lib/utils';

const navigation = [
  { name: 'Orders', href: '/account/orders' },
  { name: 'Settings', href: '/account/settings' }
];

export function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
            pathname === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}