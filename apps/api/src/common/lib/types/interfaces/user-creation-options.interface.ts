import type { RegisterDto } from '@uaa/auth/dto/register.dto';

export type UserCreationOptions = Omit<RegisterDto, 'password'> & Pick<Partial<RegisterDto>, 'password'>;
