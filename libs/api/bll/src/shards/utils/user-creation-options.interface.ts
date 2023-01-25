import { RegisterDto } from '../../features/uaa/authentification/dto/register.dto';

export type UserCreationOptions = Omit<RegisterDto, 'password'> & Pick<Partial<RegisterDto>, 'password'>;
