'use client';

import { signIn, SignInState } from '@/components/account/actions';
import { LoaderButton } from '@/components/loader-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

type FormSchema = z.infer<typeof formSchema>;

export function SignInForm() {
  const router = useRouter();
  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema)
  });
  const [state, formAction] = useActionState<SignInState, FormData>(signIn, null);
  const [pending, startTransaction] = useTransition();

  useEffect(() => {
    if (state?.type === 'error') {
      toast.error(state.message);
    } else if (state?.type === 'success') {
      toast.success('Welcome back!');
      router.replace('/');
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
