import type { ActorImageUploadProps } from '@okampus/api/dal';
import type { CreateUserDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class CreateUserCommand {
  constructor(
    public readonly createUser: CreateUserDto,
    public readonly tenant: TenantCore,
    public readonly actorImages?: ActorImageUploadProps
  ) {}
}
