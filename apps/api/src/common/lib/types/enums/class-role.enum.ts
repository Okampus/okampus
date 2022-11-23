import { registerEnumType } from '@nestjs/graphql';

export enum ClassRole {
  Representative = 'Representative',
  Substitute = 'Substitute',
  Student = 'Student',
}

registerEnumType(ClassRole, { name: 'ClassRole' });
