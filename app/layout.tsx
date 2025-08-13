import { CartProvider } from 'components/cart/cart-context';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getActiveChannel, getActiveOrder } from 'lib/vendure';
import { ensureStartsWith } from 'lib/utils';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import './globals.css';
import { ChannelProvider } from '@/components/cart/channel-context';
import { Toaster } from '@/ui-components/ui/toaster';
import { ToastProvider } from '@/ui-components/ui/toast';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const activeOrder = getActiveOrder();
  const activeChannel = getActiveChannel();

  return (
    <ToastProvider>
      <html lang="en" className={GeistSans.variable}>
        <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
          <ChannelProvider channelPromise={activeChannel}>
            <CartProvider activeOrderPromise={activeOrder}>
              <main>
                {children}
                <Toaster />
                <WelcomeToast />
              </main>
            </CartProvider>
          </ChannelProvider>
        </body>
      </html>
    </ToastProvider>
  );
}
