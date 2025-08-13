import { getCustomerOrders } from 'lib/vendure';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { readFragment } from '@/gql/graphql';
import orderFragment from '@/lib/vendure/fragments/order';

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

export default async function OrdersPage() {
  const ordersResult = await getCustomerOrders({
    sort: { createdAt: 'DESC' },
    filter: { active: { eq: false } }
  });

  const orders = ordersResult?.items || [];

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mb-8 text-gray-500">You haven't placed any orders yet.</p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-500">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((orderData) => {
            const order = readFragment(orderFragment, orderData);
            return (
              <li key={order.id}>
                <Link href={`/account/orders/${order.code}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">Order #{order.code}</p>
                            <span
                              className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order.state)}`}
                            >
                              {order.state}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>Placed on {formatDate(order.createdAt)}</p>
                            <p className="ml-4">
                              {order.totalQuantity} {order.totalQuantity === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalWithTax, order.currencyCode)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">View details →</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
