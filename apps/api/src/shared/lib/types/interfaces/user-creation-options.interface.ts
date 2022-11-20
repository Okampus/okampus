import type { RegisterDto } from '../../../../uua/auth/dto/register.dto';

export type UserCreationOptions = Omit<RegisterDto, 'password'> & Pick<Partial<RegisterDto>, 'password'>;
