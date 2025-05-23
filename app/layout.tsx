import { GeistSans } from 'geist/font/sans';
import './globals.css';

/** Providers */
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from 'components/cart/cart-context';
import { ChannelProvider } from '../components/cart/channel-context';

/** Components */
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';

/** Vendure */
import { getActiveChannel, getActiveOrder } from 'lib/vendure';

const { SITE_NAME } = process.env;

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const activeOrder = getActiveOrder();
  const activeChannel = getActiveChannel();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <ChannelProvider channelPromise={activeChannel}>
          <CartProvider activeOrderPromise={activeOrder}>
            <Navbar />
            <main>
              {children}
              <Toaster />
              <WelcomeToast />
            </main>
          </CartProvider>
        </ChannelProvider>
      </body>
    </html>
  );
}
