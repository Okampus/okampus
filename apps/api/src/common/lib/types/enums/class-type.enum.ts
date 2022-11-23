import { registerEnumType } from '@nestjs/graphql';

export enum ClassType {
  Everyone = 'Everyone',
  Program = 'Program',
  Year = 'Year',
  Sector = 'Sector',
  Class = 'Class',
}

registerEnumType(ClassType, { name: 'ClassType' });
