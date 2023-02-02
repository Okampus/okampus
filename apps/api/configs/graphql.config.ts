import { join } from 'node:path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GraphQLJSON } from 'graphql-scalars';
import { AuthModule, AuthService, UsersModule, UsersService } from '@okampus/api/bll';
// import { GraphQLUpload } from 'graphql-upload-minimal';
// import { GraphQLUpload as GQL } from '@okampus/shared/types';
import { GraphQLUpload } from 'graphql-upload-minimal';
// import { GraphQLScalarType } from 'graphql';
// import { GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

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
    return {
      statusCode: 201,
      response: {
        data: executionResult.data,
        errors,
      },
    };
  },
  // buildSchemaOptions: {
  //   scalarsMap: [{ type: GQL, scalar: GraphQLUpload }],
  // },
  // definitions: {
  //   customScalarTypeMapping: {
  //     Upload: 'Upload',
  //   },
  // },
  autoSchemaFile: join(process.cwd(), 'libs', 'shared', 'graphql', 'src', 'schema', 'schema.gql'),
  resolvers: {
    JSON: GraphQLJSON,
    Upload: GraphQLUpload,
    // UUID: CustomUuidScalar,
    // Upload: GraphQLUpload,
    // JSON2: GraphQLJSON,
    //   Upload: new GraphQLScalarType({
    //     name: "Upload",
    //     description: "The `Upload` scalar type represents a file upload.",
    //     parseValue(value) {
    //         if (value instanceof Upload) return value.promise;
    //         throw new GraphQLError("Upload value invalid.");
    //     },
    //     parseLiteral(node) {
    //         throw new GraphQLError("Upload literal unsupported.", { nodes: node });
    //     },
    //     serialize() {
    //         throw new GraphQLError("Upload serialization unsupported.");
    //     },
    // });,
  },
  subscription: {
    'graphql-ws': true,
  },
} as MercuriusDriverConfig;
