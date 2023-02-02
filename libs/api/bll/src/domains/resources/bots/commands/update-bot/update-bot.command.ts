import { UpdateDocumentDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateBotCommand {
  constructor(
    public readonly updateBot: UpdateDocumentDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
