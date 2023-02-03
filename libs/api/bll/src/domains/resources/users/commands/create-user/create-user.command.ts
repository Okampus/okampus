import { ActorImageUploadProps } from '@okampus/api/dal';
import { CreateUserDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateUserCommand {
  constructor(
    public readonly createUser: CreateUserDto,
    public readonly tenant: TenantCore,
    public readonly actorImages?: ActorImageUploadProps
  ) {}
}
