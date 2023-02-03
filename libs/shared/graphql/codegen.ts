import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema/schema.gql',
  documents: ['./src/**/*.ts'],
  generates: {
    './src/schema/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
  },
  config: {
    dedupeFragments: true,
  },
  ignoreNoDocuments: true,
};

export default config;
