import { getActiveCustomer } from 'lib/vendure';
import { CustomerSettingsForm } from '@/components/account/customer-settings-form';

export default async function SettingsPage() {
  const customer = await getActiveCustomer();

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update your personal information and account preferences.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Personal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your personal details below.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <CustomerSettingsForm customer={customer} />
        </div>
      </div>
    </div>
  );
}