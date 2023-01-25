import { UpdateBotDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateBotCommand {
  constructor(
    public readonly updateBot: UpdateBotDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
