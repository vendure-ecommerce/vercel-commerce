import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Active_CustomerFragment } from '@/lib/vendure/types';
import { User } from 'lucide-react';

export async function UserDropdown({ customer }: { customer: Active_CustomerFragment }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative flex h-11 w-auto cursor-pointer items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-medium text-black transition-colors dark:border-neutral-700 dark:text-white">
          <User className="mr-1 h-4 transition-all ease-in-out" />
          {customer.firstName} {customer.lastName}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>Dashboard</DropdownMenuItem>
        <DropdownMenuItem>Orders</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
