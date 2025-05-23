'use client';

import { Search as SearchIcon } from 'lucide-react';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="text-md dark:border-border w-full rounded-lg border bg-white px-4 py-3 text-black placeholder:text-neutral-500 md:text-sm dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute top-0 right-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="dark:border-border w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute top-0 right-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}
