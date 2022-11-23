import { registerEnumType } from '@nestjs/graphql';

export enum StudyDocType {
  ExamDE = 'ExamDE',
  ExamCE = 'ExamCE',
  ExamCC = 'ExamCC',
  ExamDM = 'ExamDM',
  ExamTAI = 'ExamTAI',
  Course = 'Course',
  Sheet = 'Sheet',
  Projects = 'Projects',
  SchoolClass = 'SchoolClass',
  EprofClass = 'EprofClass',
  ClassNote = 'ClassNote',
  Other = 'Other',
}

registerEnumType(StudyDocType, { name: 'StudyDocType' });
