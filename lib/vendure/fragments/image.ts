import { graphql } from "@/gql/graphql";

const assetFragment = graphql(`
    fragment image on Asset {
        source
        preview
        width
        height
        name
    }
`);

export default assetFragment;
