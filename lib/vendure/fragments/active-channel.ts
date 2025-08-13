import {graphql} from "@/gql/graphql";

const activeChannelFragment = graphql(`
    fragment active_channel on Channel {
        id
        code
        token
        defaultLanguageCode
        defaultCurrencyCode
        pricesIncludeTax
        defaultShippingZone {
            id
            name
        }
    }
`);

export default activeChannelFragment;