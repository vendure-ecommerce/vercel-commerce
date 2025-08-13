'use client';

import { createContext, PropsWithChildren, use, useContext } from 'react';
import { ResultOf } from 'gql.tada';
import activeChannelFragment from '@/lib/vendure/fragments/active-channel';

const ChannelContext = createContext<ResultOf<typeof activeChannelFragment> | undefined>(undefined);

export function ChannelProvider({
  channelPromise,
  children
}: PropsWithChildren<{
  channelPromise: Promise<ResultOf<typeof activeChannelFragment> | undefined>;
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
