import type { SchoolRole } from '../../modules/authorization/types/school-role.enum';

export interface UserCreationOptions {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  schoolRole: SchoolRole;
  password?: string;
}
