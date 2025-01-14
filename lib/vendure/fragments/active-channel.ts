import gql from "graphql-tag";

const activeChannelFragment = gql`
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
`;

export default activeChannelFragment;