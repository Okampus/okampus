import { CreateBotDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateBotCommand {
  constructor(public readonly createBot: CreateBotDto, public readonly tenant: TenantCore) {}
}
