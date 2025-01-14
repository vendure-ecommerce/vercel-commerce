export const getMenuQuery = /* GraphQL */ `
    query collections {
        collections(options: { take: 100, filter: { showInMenu: {eq: true}}, sort: {menuOrder: ASC} }) {
            items {
                name
                slug
            }
        }
    }
`;
