'use server';

import { authenticateCustomer, updateCustomer } from '@/lib/vendure';
import { revalidateTag } from 'next/cache';
import { AUTH_COOKIE_KEY, TAGS } from '@/lib/constants';
import { cookies } from 'next/headers';

export type SignInState =
  | {
      type: 'success';
      id: string;
    }
  | {
      type: 'error';
      message: string;
    }
  | null;

export type UpdateCustomerState =
  | {
      type: 'success';
    }
  | {
      type: 'error';
      message: string;
    }
  | null;

export async function signIn(
  prevState: SignInState | null,
  formData: FormData
): Promise<SignInState> {
  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password) {
    return {
      type: 'error',
      message: 'Missing username or password'
    };
  }

  try {
    const res = await authenticateCustomer(username.toString(), password.toString());
    revalidateTag(TAGS.customer);

    if (res.__typename === 'CurrentUser') {
      return {
        type: 'success',
        id: res.id
      };
    }

    if (res.__typename === 'InvalidCredentialsError' || res.__typename === 'NotVerifiedError') {
      return {
        type: 'error',
        message: res.message
      };
    }

    return {
      type: 'error',
      message: 'Error signing in'
    };
  } catch (e) {
    return {
      type: 'error',
      message: 'Error signing in'
    };
  }
}

export async function updateCustomerAction(
  prevState: UpdateCustomerState | null,
  formData: FormData
): Promise<UpdateCustomerState> {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');

  if (!firstName || !lastName) {
    return {
      type: 'error',
      message: 'First name and last name are required'
    };
  }

  try {
    await updateCustomer({
      firstName: firstName.toString(),
      lastName: lastName.toString()
    });

    revalidateTag(TAGS.customer);

    return {
      type: 'success'
    };
  } catch (e: any) {
    return {
      type: 'error',
      message: e.message || 'Error updating profile'
    };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('vendure-token');
  revalidateTag(TAGS.customer);
  revalidateTag(TAGS.cart);
}
