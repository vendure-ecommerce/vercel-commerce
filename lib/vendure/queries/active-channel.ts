import activeChannelFragment from '../fragments/active-channel';
import {graphql} from "@/gql/graphql";

export const getActiveChannelQuery = graphql(`
  query getActiveChannel {
    activeChannel {
      ...active_channel
    }
  }
`, [activeChannelFragment]);
