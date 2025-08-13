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
import { signIn, SignInState } from '@/components/account/actions';
import { useActionState, useEffect, useTransition } from 'react';
import { useToast } from '@/ui-components/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

type FormSchema = z.infer<typeof formSchema>;

export function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema)
  });
  const [state, formAction] = useActionState<SignInState, FormData>(signIn, null);
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
        description: 'Welcome back!'
      });
      router.replace('/account');
    }
  }, [state]);

  return (
    <Form {...form}>
      <form
        action={(formData) => startTransaction(() => formAction(formData))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <LoaderButton loading={pending} className="w-full" type="submit">
          Sign in
        </LoaderButton>
      </form>
    </Form>
  );
}
