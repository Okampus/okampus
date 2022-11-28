import { registerEnumType } from '@nestjs/graphql';

export enum TenantImageType {
  Logo = 'Logo',
  LogoDark = 'LogoDark',
  Profile = 'Profile',
  Other = 'Other',
}

registerEnumType(TenantImageType, { name: 'TenantImageType' });
