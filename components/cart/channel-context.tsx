'use client'

import { createContext, PropsWithChildren, use, useContext, useOptimistic } from 'react';
import { GetActiveChannelQuery } from '../../lib/vendure/types';

const ChannelContext = createContext<GetActiveChannelQuery | undefined>(undefined);

export function ChannelProvider({
  channelPromise,
  children
}: PropsWithChildren<{
  channelPromise: Promise<GetActiveChannelQuery | undefined>;
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
