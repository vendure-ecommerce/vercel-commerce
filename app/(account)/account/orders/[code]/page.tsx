import { getOrderByCode } from 'lib/vendure';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { readFragment } from '@/gql/graphql';
import productFragment from '@/lib/vendure/fragments/product';
import assetFragment from '@/lib/vendure/fragments/image';
import { orderAddressFragment } from '@/lib/vendure/fragments/order';

interface OrderDetailPageProps {
  params: Promise<{ code: string }>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getOrderStatusColor(state: string) {
  switch (state.toLowerCase()) {
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'shipped':
    case 'fulfilled':
      return 'text-blue-600 bg-blue-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { code } = await params;
  const order = await getOrderByCode(code);

  if (!order) {
    notFound();
  }

  return (
    <div className="py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            ← Back to orders
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Order #{order.code}</h1>
          <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getOrderStatusColor(order.state)}`}
        >
          {order.state}
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-8">
          <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {order.lines.map((line) => {
                  const product = readFragment(productFragment, line.productVariant.product);
                  const featuredAsset = product.featuredAsset
                    ? readFragment(assetFragment, product.featuredAsset)
                    : null;

                  return (
                    <li key={line.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {featuredAsset?.source && (
                            <Image
                              src={featuredAsset.source}
                              alt={line.productVariant.name}
                              width={64}
                              height={64}
                              className="h-10 w-10 rounded-lg object-cover object-center"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {line.productVariant.name}
                          </p>
                          {line.productVariant.options.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {line.productVariant.options
                                .map((option) => `${option.group.name}: ${option.name}`)
                                .join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">Quantity: {line.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(line.linePriceWithTax, order.currencyCode)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(line.unitPriceWithTax, order.currencyCode)} each
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress &&
            (() => {
              const shippingAddress = readFragment(orderAddressFragment, order.shippingAddress);
              return (
                <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.streetLine1}</p>
                      {shippingAddress.streetLine2 && <p>{shippingAddress.streetLine2}</p>}
                      <p>
                        {shippingAddress.city}, {shippingAddress.province}{' '}
                        {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      {shippingAddress.phoneNumber && (
                        <p className="mt-1">Phone: {shippingAddress.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        <div className="lg:col-span-4">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="flex justify-between px-4 py-3 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                  <dd className="text-sm text-gray-900">
                    {formatCurrency(order.subTotalWithTax, order.currencyCode)}
                  </dd>
                </div>
                <div className="flex justify-between px-4 py-3 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                  <dd className="text-sm text-gray-900">
                    {formatCurrency(order.shippingWithTax, order.currencyCode)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatCurrency(order.totalWithTax, order.currencyCode)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Billing Address */}
          {order.billingAddress &&
            (() => {
              const billingAddress = readFragment(orderAddressFragment, order.billingAddress);
              return (
                <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Billing Address</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{billingAddress.fullName}</p>
                      <p>{billingAddress.streetLine1}</p>
                      {billingAddress.streetLine2 && <p>{billingAddress.streetLine2}</p>}
                      <p>
                        {billingAddress.city}, {billingAddress.province} {billingAddress.postalCode}
                      </p>
                      <p>{billingAddress.country}</p>
                      {billingAddress.phoneNumber && (
                        <p className="mt-1">Phone: {billingAddress.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
