import { join } from 'node:path';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { config } from './config';

export default {
  driver: ApolloDriver,
  bodyParserConfig: false,
  autoSchemaFile: join(process.cwd(), 'src', 'schema.gql'),
  sortSchema: true,
  debug: config.get('nodeEnv') === 'development',
  playground: config.get('nodeEnv') === 'development',
} as ApolloDriverConfig;
