import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui-components/ui/card';
import Link from 'next/link';
import {SignInForm} from "@/components/account/sign-in-form";

export default async function SignIn() {
  return (
    <section className="flex mt-24 items-center justify-center">
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
