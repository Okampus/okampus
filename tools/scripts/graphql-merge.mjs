import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import { writeFileSync } from 'fs';

const loadedFiles = loadFilesSync(['apps/api/**/*.gql', 'libs/api/**/*.gql']);
const typeDefs = mergeTypeDefs(loadedFiles);
const printedTypeDefs = print(typeDefs);
writeFileSync('./libs/shared/graphql/src/schema.merged.graphql', printedTypeDefs);
