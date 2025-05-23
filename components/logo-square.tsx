import { cn } from '@/ui-components/lib/utils';
import LogoIcon from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={cn(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <LogoIcon
        className={cn({
          'h-[22px] w-[22px]': !size,
          'h-[16px] w-[16px]': size === 'sm'
        })}
      />
    </div>
  );
}
