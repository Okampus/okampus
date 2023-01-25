import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  ActorImage,
  Bot,
  Content,
  EventApproval,
  EventApprovalStep,
  Form,
  FormSubmission,
  ImageUpload,
  Individual,
  Org,
  Social,
  Tag,
  Team,
  Tenant,
  TenantEvent,
  User,
} from '@okampus/api/dal';
import { BotFactory } from './bots/bot.factory';
import { ContentFactory } from './contents/content.factory';
import { EventApprovalFactory } from './events/event-approval.factory';
import { TenantEventFactory } from './events/event.factory';
import { FormSubmissionFactory } from './forms/form-submission.factory';
import { FormFactory } from './forms/form.factory';
import { ActorImageFactory } from './images/actor-image.factory';
import { ImageUploadFactory } from './images/image-upload.factory';
import { SocialFactory } from './socials/social.factory';
import { TagFactory } from './tags/tag.factory';
import { TeamFactory } from './teams/team.factory';
import { EventApprovalStepFactory } from './events/event-approval-step.factory';
import { TenantFactory } from './tenants/tenant.factory';
import { UserFactory } from './users/user.factory';

const factories = [
  UserFactory,
  BotFactory,
  SocialFactory,
  ImageUploadFactory,
  TagFactory,
  ActorImageFactory,
  TeamFactory,
  FormFactory,
  ContentFactory,
  TenantFactory,
  TenantEventFactory,
  EventApprovalFactory,
  EventApprovalStepFactory,
  FormSubmissionFactory,
];

const entities = [
  Individual,
  Org,
  User,
  Bot,
  Social,
  ImageUpload,
  Tag,
  ActorImage,
  Team,
  Form,
  Content,
  Tenant,
  TenantEvent,
  EventApproval,
  EventApprovalStep,
  FormSubmission,
];

@Global()
@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature(entities)],
  providers: [...factories],
  exports: [...factories],
})
export class FactoryModule {}
