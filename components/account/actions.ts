'use server';

import { authenticateCustomer } from '@/lib/vendure';
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
