import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function OpenSignIn({ className }: { className?: string }) {
  return (
    <Link
      href={'/sign-in'}
      className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
    >
      <User className={cn('h-4 transition-all ease-in-out hover:scale-110', className)} />
    </Link>
  );
}
