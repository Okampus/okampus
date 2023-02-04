import { Resolver, Mutation, Args } from '@nestjs/graphql';
import type { OrgDocumentsService } from './org-documents.service';
import type { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType } from '@okampus/shared/types';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';

@Resolver(() => OrgDocumentModel)
export class OrgDocumentsResolver {
  constructor(private readonly orgDocumentsService: OrgDocumentsService) {}

  @Mutation(() => OrgDocumentModel)
  createOrgDocument(
    @Args('orgId') orgId: string,
    @Args('createOrgDocument') createOrgDocument: CreateOrgDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ) {
    return this.orgDocumentsService.create(orgId, createOrgDocument, documentFile);
  }
}
