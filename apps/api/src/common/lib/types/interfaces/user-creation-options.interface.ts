import type { RegisterDto } from '@modules/uua/auth/dto/register.dto';

export type UserCreationOptions = Omit<RegisterDto, 'password'> & Pick<Partial<RegisterDto>, 'password'>;
