import type { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

export class CreateOrgDocumentCommand {
  constructor(
    public readonly orgId: Snowflake,
    public readonly createOrgDocument: CreateOrgDocumentDto,
    public readonly documentFile: MulterFileType,
    public readonly tenant: TenantCore
  ) {}
}
