import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { OrgDocumentFactory } from '../../../../factories/domains/documents/org-document.factory';
import type { OrgDocumentModel } from '../../../../factories/domains/documents/org-document.model';
import { CreateOrgDocumentCommand } from './create-org-document.command';

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
