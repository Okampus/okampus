import { Module } from '@nestjs/common';
import { OrgDocumentsService } from './org-documents.service';
import { OrgDocumentsResolver } from './org-documents.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Bot, User } from '@okampus/api/dal';
import { CreateOrgDocumentHandler } from './commands/create-org-document/create-org-document.handler';

const commandHandlers = [CreateOrgDocumentHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Bot, Actor, User])],
  providers: [OrgDocumentsResolver, OrgDocumentsService, ...commandHandlers],
  exports: [OrgDocumentsService],
})
export class OrgDocumentsModule {}
