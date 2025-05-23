'use client';

import type { ActiveOrderQuery, Product, ProductVariant } from 'lib/vendure/types';
import React, { createContext, use, useContext, useMemo } from 'react';

type UpdateType = 'plus' | 'minus' | 'delete';

type ActiveOrder = Pick<ActiveOrderQuery, 'activeOrder'>['activeOrder'];

type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { merchandiseId: string; updateType: UpdateType } }
  | { type: 'ADD_ITEM'; payload: { variant: ProductVariant; product: Product } };

type CartContextType = {
  cart: ActiveOrder | undefined;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  activeOrderPromise
}: {
  children: React.ReactNode;
  activeOrderPromise: Promise<ActiveOrder | undefined>;
}) {
  const initialCart = use(activeOrderPromise);

  const value = useMemo(
    () => ({
      cart: initialCart
    }),
    [initialCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
