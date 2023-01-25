import { UpdateUserDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateUserCommand {
  constructor(
    public readonly updateUser: UpdateUserDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
