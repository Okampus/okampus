import { CreateOrgDocumentCommand } from './create-org-document.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrgDocumentFactory } from '../../../../factories/domains/documents/org-document.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { OrgDocumentModel } from '../../../../factories/domains/documents/org-document.model';

@CommandHandler(CreateOrgDocumentCommand)
export class CreateOrgDocumentHandler implements ICommandHandler<CreateOrgDocumentCommand> {
  constructor(private readonly orgDocumentFactory: OrgDocumentFactory) {}

  async execute(command: CreateOrgDocumentCommand): Promise<OrgDocumentModel> {
    return await this.orgDocumentFactory.createOrgDocument(
      command.orgId,
      command.createOrgDocument,
      command.documentFile,
      command.tenant
    );
  }
}
