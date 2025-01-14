'use client';

import { createContext, PropsWithChildren, use, useContext } from 'react';
import { GetActiveChannelQuery } from '../../lib/vendure/types';

type ActiveCannel = Pick<GetActiveChannelQuery, 'activeChannel'>

const ChannelContext = createContext<ActiveCannel | undefined>(undefined);

export function ChannelProvider({
  channelPromise,
  children
}: PropsWithChildren<{
  channelPromise: Promise<ActiveCannel | undefined>;
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
