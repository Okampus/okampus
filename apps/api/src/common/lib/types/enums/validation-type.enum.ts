import { registerEnumType } from '@nestjs/graphql';

export enum ValidationType {
  Op = 'Op',
  Admin = 'Admin',
}

registerEnumType(ValidationType, { name: 'ValidationType' });
