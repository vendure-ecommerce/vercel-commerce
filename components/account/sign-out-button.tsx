'use client';

import { DropdownMenuItem } from '@/ui-components/ui/dropdown-menu';
import { signOutAction } from './actions';

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOutAction();
    window.location.href = '/';
  };

  return (
    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
      Sign out
    </DropdownMenuItem>
  );
}