export const getMenuQuery = /* GraphQL */ `
  query collections {
    collections(options: { take: 100 }) {
      items {
        name
        slug
      }
    }
  }
`;