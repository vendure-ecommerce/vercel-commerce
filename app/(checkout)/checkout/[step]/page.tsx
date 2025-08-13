import { checkoutSteps } from '@/lib/vendure/checkout';
import { redirect } from 'next/navigation';

export default async function CheckoutStep(props: { params: Promise<{ step: string }> }) {
  const params = await props.params;
  const step = checkoutSteps.find((step) => step.identifier == params.step);

  if (!step) {
    return redirect('/');
  }

  return step?.component;
}
