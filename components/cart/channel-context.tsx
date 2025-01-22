'use client';

import { createContext, PropsWithChildren, use, useContext } from 'react';
import { Active_ChannelFragment } from '@/lib/vendure/types';

const ChannelContext = createContext<Active_ChannelFragment | undefined>(undefined);

export function ChannelProvider({
  channelPromise,
  children
}: PropsWithChildren<{
  channelPromise: Promise<Active_ChannelFragment | undefined>;
}>) {
  const channel = use(channelPromise);

  return <ChannelContext.Provider value={channel}>{children}</ChannelContext.Provider>;
}

export function useActiveChannel() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
}
