import gql from 'graphql-tag';
import activeChannelFragment from '../fragments/active-channel';

export const getActiveChannelQuery = gql`
  query getActiveChannel {
    activeChannel {
      ...active_channel
    }
  }
  ${activeChannelFragment}
`;
