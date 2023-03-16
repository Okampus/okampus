import { BotFactory } from './domains/bots/bot.factory';
import { ContentFactory } from './domains/contents/content.factory';
import { EventApprovalFactory } from './domains/events/event-approval.factory';
import { TenantEventFactory } from './domains/events/event.factory';
import { FormSubmissionFactory } from './domains/forms/form-submission.factory';
import { FormFactory } from './domains/forms/form.factory';
import { ActorImageFactory } from './domains/images/actor-image.factory';
import { ImageUploadFactory } from './domains/images/image-upload.factory';
import { SocialFactory } from './domains/socials/social.factory';
import { TagFactory } from './domains/tags/tag.factory';
import { TeamFactory } from './domains/teams/team.factory';
import { EventApprovalStepFactory } from './domains/events/event-approval-step.factory';
import { TenantFactory } from './domains/tenants/tenant.factory';
import { UserFactory } from './domains/users/user.factory';
import { FinanceFactory } from './domains/teams/finance.factory';
import { ProjectFactory } from './domains/teams/project.factory';
import { TeamCategoryFactory } from './domains/tags/team-category.factory';
import { OrgDocumentFactory } from './domains/documents/org-document.factory';
import { TeamJoinFactory } from './domains/teams/team-join.factory';
import {
  Actor,
  ActorImage,
  Bot,
  Content,
  EventApproval,
  EventApprovalStep,
  Finance,
  Form,
  FormEdit,
  FormSubmission,
  ImageUpload,
  Individual,
  Org,
  OrgDocument,
  Project,
  Shortcut,
  Social,
  Tag,
  Team,
  TeamCategory,
  TeamJoin,
  TeamMember,
  TeamRole,
  Tenant,
  TenantEvent,
  User,
} from '@okampus/api/dal';
import { CqrsModule } from '@nestjs/cqrs';
import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

const factories = [
  UserFactory,
  BotFactory,
  SocialFactory,
  ImageUploadFactory,
  TagFactory,
  ActorImageFactory,
  TeamFactory,
  TeamJoinFactory,
  FormFactory,
  ContentFactory,
  TenantFactory,
  TenantEventFactory,
  EventApprovalFactory,
  EventApprovalStepFactory,
  FormSubmissionFactory,
  FinanceFactory,
  ProjectFactory,
  TeamCategoryFactory,
  OrgDocumentFactory,
];

const entities = [
  Actor,
  Individual,
  Org,
  User,
  Bot,
  Social,
  ImageUpload,
  Tag,
  ActorImage,
  Team,
  TeamJoin,
  Form,
  FormEdit,
  Content,
  Tenant,
  TenantEvent,
  EventApproval,
  EventApprovalStep,
  FormSubmission,
  TeamMember,
  Shortcut,
  TeamRole,
  Finance,
  Project,
  TeamCategory,
  OrgDocument,
];

@Global()
@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature(entities)],
  providers: [...factories],
  exports: [...factories],
})
export class FactoryModule {}
