// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrgDocumentsService } from './org-documents.service';

import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => OrgDocumentModel)
export class OrgDocumentsResolver {
  constructor(private readonly orgDocumentsService: OrgDocumentsService) {}

  @Mutation(() => OrgDocumentModel)
  createOrgDocument(
    @Args('orgId', { type: () => String }) orgId: Snowflake,
    @Args('createOrgDocument', { type: () => CreateOrgDocumentDto }) createOrgDocument: CreateOrgDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ) {
    return this.orgDocumentsService.create(orgId, createOrgDocument, documentFile);
  }
}
