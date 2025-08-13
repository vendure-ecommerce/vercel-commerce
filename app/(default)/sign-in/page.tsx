import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui-components/ui/card';
import Link from 'next/link';
import { SignInForm } from '@/components/account/sign-in-form';
import { Alert, AlertDescription, AlertTitle } from '@/ui-components/ui/alert';

export default async function SignIn() {
  return (
    <section className="mt-24 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-2">
            <AlertTitle>Test Credentials</AlertTitle>
            <AlertDescription>
              <div>
                <strong>E-Mail: </strong> test@vendure.io
                <br />
                <strong>Password: </strong> test
              </div>
            </AlertDescription>
          </Alert>
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
