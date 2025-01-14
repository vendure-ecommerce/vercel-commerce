import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VENDURE_API_ENDPOINT,
  documents: ['lib/vendure/**/*.ts'],
  generates: {
    './lib/vendure/types.ts': {
      config: {
        scalars: { Money: 'number' },
        namingConvention: { enumValues: 'keep' }
      },
      plugins: ['typescript', 'typescript-operations', 'typed-document-node']
    }
  }
};

export default config;
