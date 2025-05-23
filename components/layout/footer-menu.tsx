'use client';

import { cn } from '@/ui-components/lib/utils';
import { CollectionsQuery } from 'lib/vendure/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FooterMenuItem({ item }: { item: CollectionsQuery['collections']['items'][0] }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.slug);

  useEffect(() => {
    setActive(pathname === item.slug);
  }, [pathname, item.slug]);

  return (
    <li>
      <Link
        href={item.slug}
        className={cn(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.name}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: CollectionsQuery['collections']['items'] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return <FooterMenuItem key={item.slug} item={item} />;
        })}
      </ul>
    </nav>
  );
}
