export const getMenuQuery = `
  query collections {
    collections(options: { take: 100, topLevelOnly: true }) {
      items {
        name
        slug
      }
    }
  }
`;
