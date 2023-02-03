import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrgDocumentFactory } from '../../../../factories/domains/documents/org-document.factory';
import { OrgDocumentModel } from '../../../../factories/domains/documents/org-document.model';
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
