import { registerEnumType } from '@nestjs/graphql';

export enum ValidationType {
  OpValidated = 'op',
  AdminValidated = 'admin',
}

registerEnumType(ValidationType, { name: 'ValidationType' });
