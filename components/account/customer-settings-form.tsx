'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui-components/ui/form';
import { Input } from '@/ui-components/ui/input';
import { LoaderButton } from '@/components/loader-button';
import { updateCustomerAction } from '@/components/account/actions';
import { useActionState, useEffect, useTransition } from 'react';
import { useToast } from '@/ui-components/hooks/use-toast';
import { ResultOf } from 'gql.tada';
import { activeCustomerFragment } from '@/lib/vendure/queries/active-customer';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
});

type FormSchema = z.infer<typeof formSchema>;

interface CustomerSettingsFormProps {
  customer: ResultOf<typeof activeCustomerFragment> | null;
}

export function CustomerSettingsForm({ customer }: CustomerSettingsFormProps) {
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || ''
    }
  });

  const [state, formAction] = useActionState(updateCustomerAction, null);
  const [pending, startTransaction] = useTransition();

  useEffect(() => {
    if (state?.type === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message
      });
    } else if (state?.type === 'success') {
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Your information has been updated successfully!'
      });
    }
  }, [state, toast]);

  return (
    <Form {...form}>
      <form
        action={(formData) => startTransaction(() => formAction(formData))}
        className="space-y-6 max-w-md"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input 
            type="email" 
            value={customer?.emailAddress || ''} 
            disabled 
            className="bg-gray-50"
          />
          <p className="text-sm text-gray-500 mt-1">
            Email address cannot be changed. Please contact support if you need to update this.
          </p>
        </div>

        <LoaderButton loading={pending} type="submit">
          Save Changes
        </LoaderButton>
      </form>
    </Form>
  );
}