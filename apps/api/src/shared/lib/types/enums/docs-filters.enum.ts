import { registerEnumType } from '@nestjs/graphql';

export enum StudyDocFilter {
  Subject = 'Subject',
  Type = 'Type',
  Year = 'Year',
}

export enum InfoDocFilter {
  Year = 'Year',
}

registerEnumType(StudyDocFilter, { name: 'StudyDocFilter' });
registerEnumType(InfoDocFilter, { name: 'InfoDocFilter' });
