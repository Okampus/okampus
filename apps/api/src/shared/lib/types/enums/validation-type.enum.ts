import { registerEnumType } from '@nestjs/graphql';

export enum ValidationType {
  Op = 'op',
  Admin = 'admin',
}

registerEnumType(ValidationType, { name: 'ValidationType' });
