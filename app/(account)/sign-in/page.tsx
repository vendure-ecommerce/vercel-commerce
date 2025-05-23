import { SignInForm } from '@/components/account/sign-in-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';

export default async function SignIn() {
  return (
    <section className="mt-24 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <Link className="text-center text-neutral-500 underline" href="/forgot-password">
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
