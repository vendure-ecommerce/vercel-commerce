import { Button } from '@/ui-components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ComponentProps } from 'react';

type LoaderButtonProps = {
  loading?: boolean;
};

export function LoaderButton({
  loading,
  children,
  ...props
}: LoaderButtonProps & ComponentProps<typeof Button>) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  );
}
