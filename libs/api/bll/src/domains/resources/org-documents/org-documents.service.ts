import { CreateOrgDocumentCommand } from './commands/create-org-document/create-org-document.command';
import { RequestContext } from '../../../shards/abstract/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';

@Injectable()
export class OrgDocumentsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  create(
    orgId: Snowflake,
    createOrgDocument: CreateOrgDocumentDto,
    documentFile: MulterFileType
  ): Promise<OrgDocumentModel> {
    const command = new CreateOrgDocumentCommand(orgId, createOrgDocument, documentFile, this.tenant());
    return this.commandBus.execute(command);
  }
}
