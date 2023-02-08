import { appPath } from './config';
import { AuthModule, AuthService, UsersModule, UsersService } from '@okampus/api/bll';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GraphQLJSON } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload-minimal';

import type { MercuriusDriverConfig } from '@nestjs/mercurius';

export const schemaFilePath = `${appPath}/../../libs/shared/graphql/src/schema/schema.gql`;

export default {
  imports: [JwtModule, UsersModule, AuthModule],
  inject: [JwtService, UsersService, AuthService],
  driver: MercuriusDriver,
  errorFormatter: (executionResult, context) => {
    const log = context.reply ? context.reply.log : context.app.log;
    const errors = executionResult?.errors?.map((error) => {
      error.extensions.exception = error.originalError;
      Object.defineProperty(error, 'extensions', { enumerable: true });
      return error;
    });

    log.info({ err: executionResult.errors }, 'Argument Validation Error');
    const response = { data: executionResult.data, errors };
    return { statusCode: 201, response };
  },
  autoSchemaFile: schemaFilePath, // TODO: DX fix, schema file is doubled loaded when shared lib modified in vite dev mode
  resolvers: { JSON: GraphQLJSON, Upload: GraphQLUpload },
  subscription: { 'graphql-ws': true },
} as MercuriusDriverConfig;
