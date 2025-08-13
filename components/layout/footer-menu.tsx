'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ResultOf } from 'gql.tada';
import { collectionFragment } from '@/lib/vendure/queries/collection';

export function FooterMenuItem({ item }: { item: ResultOf<typeof collectionFragment> }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.slug);

  useEffect(() => {
    setActive(pathname === item.slug);
  }, [pathname, item.slug]);

  return (
    <li>
      <Link
        href={`/search/${item.slug}`}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
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

export default function FooterMenu({
  menu
}: {
  menu: ResultOf<typeof collectionFragment>[];
}) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return <FooterMenuItem key={item.id} item={item} />;
        })}
      </ul>
    </nav>
  );
}
