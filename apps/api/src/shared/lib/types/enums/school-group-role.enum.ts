import { registerEnumType } from '@nestjs/graphql';

export enum SchoolGroupRole {
  Representative = 'Representative',
  Substitute = 'Substitute',
  Student = 'Student',
}

registerEnumType(SchoolGroupRole, { name: 'SchoolGroupRole' });
