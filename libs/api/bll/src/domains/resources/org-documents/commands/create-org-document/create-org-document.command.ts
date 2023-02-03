import { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';
import { MulterFileType, Snowflake } from '@okampus/shared/types';

export class CreateOrgDocumentCommand {
  constructor(
    public readonly orgId: Snowflake,
    public readonly createOrgDocument: CreateOrgDocumentDto,
    public readonly documentFile: MulterFileType,
    public readonly tenant: TenantCore
  ) {}
}
