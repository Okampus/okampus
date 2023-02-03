import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import { MulterFileType, Snowflake } from '@okampus/shared/types';
import { RequestContext } from '../../../shards/request-context/request-context';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';
import { CreateOrgDocumentCommand } from './commands/create-org-document/create-org-document.command';

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
