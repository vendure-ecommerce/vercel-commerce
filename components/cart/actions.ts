'use server';

import { TAGS } from 'lib/constants';
import { addToCart, adjustCartItem, removeFromCart } from 'lib/vendure';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addItem(prevState: any, selectedVariantId: string | undefined) {
  if (!selectedVariantId) {
    return 'Missing variant ID';
  }

  try {
    await addToCart(selectedVariantId, 1);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    await removeFromCart(merchandiseId);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    await adjustCartItem(merchandiseId, quantity);
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  // TODO: resolve first step of checkout

  redirect('/checkout');
}
