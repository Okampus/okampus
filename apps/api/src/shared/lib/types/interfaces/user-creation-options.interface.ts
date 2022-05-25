import type { RegisterDto } from '../../../../auth/dto/register.dto';

export type UserCreationOptions = Omit<RegisterDto, 'password'> & Pick<Partial<RegisterDto>, 'password'>;
