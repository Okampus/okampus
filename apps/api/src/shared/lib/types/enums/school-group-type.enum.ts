import { registerEnumType } from '@nestjs/graphql';

export enum SchoolGroupType {
  Everyone,
  Program,
  Year,
  Sector,
  Class,
}

registerEnumType(SchoolGroupType, { name: 'SchoolGroupType' });
