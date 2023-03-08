import type { UpdateUserDto } from '@okampus/shared/dtos';
import type { ActorImageUploadProps, TenantCore } from '@okampus/api/dal';

export class UpdateUserCommand {
  constructor(
    public readonly updateUser: UpdateUserDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[],
    public readonly actorImages?: ActorImageUploadProps
  ) {}
}
