import { rootPath } from './config';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GraphQLUpload } from 'graphql-upload-minimal';

import type { MercuriusDriverConfig } from '@nestjs/mercurius';

export const schemaPath = `${rootPath}/libs/shared/graphql/src/schema.merged.graphql`;

const mercuriusConfig: MercuriusDriverConfig = {
  driver: MercuriusDriver,
  errorFormatter: (executionResult, context) => {
    const log = context.reply ? context.reply.log : context.app.log;
    const errors = executionResult.errors.map((error) => {
      error.extensions.exception = error.originalError;
      Object.defineProperty(error, 'extensions', { enumerable: true });
      return error;
    });

    log.info({ errors: executionResult.errors }, 'Argument Validation Error');
    return { statusCode: 201, response: { data: executionResult.data, errors } };
  },
  typePaths: [schemaPath],
  subscription: true,
  resolvers: { Upload: GraphQLUpload },
};

export default mercuriusConfig;
