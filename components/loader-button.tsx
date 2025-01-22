import { ComponentProps } from 'react';
import { Button } from '@/ui-components/ui/button';
import { CgSpinner } from 'react-icons/cg';

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
      {loading ? <CgSpinner /> : children}
    </Button>
  );
}
