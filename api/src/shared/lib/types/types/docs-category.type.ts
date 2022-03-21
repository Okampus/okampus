export interface Category<T extends InfoDocCategoryType | StudyDocCategoryType> {
  title: string;
  context: T;
  children: Array<Category<T>>;
}

export enum StudyDocCategoryType {
  SchoolYear = 'schoolYear',
  Subject = 'subject',
  Type = 'type',
  Year = 'year',
}

export enum InfoDocCategoryType {
  SchoolYear = 'schoolYear',
  Year = 'year',
}
