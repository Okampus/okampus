export interface Category { name: string; children: Category[] }

export enum CategoryType {
  SchoolYear = 'schoolYear',
  Subject = 'subject',
  Type = 'type',
  Year = 'year',
}
