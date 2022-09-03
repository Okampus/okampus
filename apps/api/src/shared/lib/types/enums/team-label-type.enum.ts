import { registerEnumType } from '@nestjs/graphql';

export enum TeamLabelType {
  Category = 'Category',
  Descriptor = 'Descriptor',
  Meta = 'Meta',
}

registerEnumType(TeamLabelType, { name: 'TeamLabelType' });
