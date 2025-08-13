import React from 'react';
import { Addresses } from '@/components/checkout/addresses';
import { ResultOf } from 'gql.tada';
import activeOrderFragment from '@/lib/vendure/fragments/active-order';

export type CheckoutStep = {
  title?: string;
  identifier: string;
  validate: (order: ResultOf<typeof activeOrderFragment>) => boolean;
  commit?: any;
  component?: React.ReactNode;
};

export const checkoutSteps: Array<CheckoutStep> = [
  {
    title: 'Addresses',
    identifier: 'addresses',
    validate: (order) => {
      return !!order.billingAddress && !!order.shippingAddress;
    },
    component: <Addresses />
  },
  {
    title: 'Shipping',
    identifier: 'shipping',
    validate: (order) => {
      // TODO: where to store shipping method?
      return false;
    }
  },
  {
    title: 'Payment',
    identifier: 'payment',
    validate: (order) => {
      // TODO: where to store payment method?
      return false;
    }
  },
  {
    title: 'Summary',
    identifier: 'summary',
    validate: (order) => {
      // TODO: check everything again
      return false;
    }
  }
];

export function getCheckoutSteps(
  currentStep: string | undefined = undefined
): Array<CheckoutStep & { active: boolean; done: boolean }> {
  return checkoutSteps.map((step) => {
    return {
      ...step,
      active: step.identifier === currentStep,
      done:
        checkoutSteps.findIndex((s) => s.identifier === currentStep) >
        checkoutSteps.findIndex((s) => s.identifier === step.identifier)
    };
  });
}
