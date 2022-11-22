import { registerEnumType } from '@nestjs/graphql';

export enum LabelType {
  Category = 'Category',
  Descriptor = 'Descriptor',
  Meta = 'Meta',
}

registerEnumType(LabelType, { name: 'TeamLabelType' });
