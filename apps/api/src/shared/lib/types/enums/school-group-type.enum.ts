import { registerEnumType } from '@nestjs/graphql';

export enum SchoolGroupType {
  Everyone = 'Everyone',
  Program = 'Program',
  Year = 'Year',
  Sector = 'Sector',
  Class = 'Class',
}

registerEnumType(SchoolGroupType, { name: 'SchoolGroupType' });
