import { Actor } from './actor/actor.entity';
import { Bot } from './actor/bot/bot.entity';
import { Individual } from './actor/individual/individual.entity';
import { Shortcut } from './actor/shortcut/shortcut.entity';
import { UserProfile } from './actor/user-profile/user-profile.entity';
import { User } from './actor/user/user.entity';
import { ContentMaster } from './content-master/content-master.entity';
import { TenantEvent } from './content-master/event/event.entity';
import { DocumentUpload } from './file-upload/document-upload/document-upload.entity';
import { FileUpload } from './file-upload/file-upload.entity';
import { ImageUpload } from './file-upload/image-upload/image-upload.entity';
import { VideoUpload } from './file-upload/video-upload/video-upload.entity';
import { Favorite } from './interaction/favorite/favorite.entity';
import { Interaction } from './interaction/interaction.entity';
import { Reaction } from './interaction/reaction/reaction.entity';
import { Report } from './interaction/report/report.entity';
import { Validation } from './interaction/validation/validation.entity';
import { Vote } from './interaction/vote/vote.entity';
import { EventJoin } from './join/event-join/event-join.entity';
import { Join } from './join/join.entity';
import { TeamJoin } from './join/team-join/team-join.entity';
import { Subject } from './label/subject/subject.entity';
import { Tag } from './label/tag/tag.entity';
import { TeamCategory } from './label/team-category/team-category.entity';
import { ActorImage } from './manage-actor/actor-image/actor-image.entity';
import { Social } from './manage-actor/social/social.entity';
import { OrgDocument } from './manage-org/org-document/org-document.entity';
import { OrgMetric } from './manage-org/org-metric/org-metric.entity';
import { Finance } from './manage-team/finance/finance.entity';
import { Project } from './manage-team/project/project.entity';
import { TeamAction } from './manage-team/team-action/team-action.entity';
import { EventApprovalStep } from './manage-tenant/event-approval-step/event-approval-step.entity';
import { EventApproval } from './manage-tenant/event-approval/event-approval.entity';
import { Session } from './manage-user/session/session.entity';
import { TeachClass } from './manage-user/teach-class/teach-class.entity';
import { CanteenMember } from './membership/canteen-member/canteen-member.entity';
import { ClassGroupMember } from './membership/class-group-member/class-group-member.entity';
import { CohortMember } from './membership/cohort-member/cohort-member.entity';
import { Membership } from './membership/membership.entity';
import { TeamMember } from './membership/team-member/team-member.entity';
import { TenantMember } from './membership/tenant-member/tenant-member.entity';
import { Canteen } from './org/canteen/canteen.entity';
import { ClassGroup } from './org/class-group/class-group.entity';
import { Cohort } from './org/cohort/cohort.entity';
import { Org } from './org/org.entity';
import { Team } from './org/team/team.entity';
import { TenantCore } from './org/tenant/tenant-core.entity';
import { Tenant } from './org/tenant/tenant.entity';
import { CanteenRole } from './role/canteen-role/canteen-role.entity';
import { Role } from './role/role.entity';
import { TeamRole } from './role/team-role/team-role.entity';
import { ContentEdit } from './ugc/content-edit/content-edit.entity';
import { Content } from './ugc/content/content.entity';
import { DocumentEdit } from './ugc/document-edit/document-edit.entity';
import { TenantDocument } from './ugc/document/document.entity';
import { FormEdit } from './ugc/form-edit/form-edit.entity';
import { FormSubmissionEdit } from './ugc/form-submission-edit/form-submission-edit.entity';
import { FormSubmission } from './ugc/form-submission/form-submission.entity';
import { Form } from './ugc/form/form.entity';
import { Ugc } from './ugc/ugc.entity';

export const allEntities = [
  Actor,

  Individual,
  Bot,
  User,
  UserProfile,
  Shortcut,

  Org,
  Canteen,
  ClassGroup,
  Cohort,
  Team,
  Tenant,
  TenantCore,

  ContentMaster,
  TenantEvent,

  FileUpload,
  DocumentUpload,
  ImageUpload,
  VideoUpload,

  Interaction,
  Favorite,
  Reaction,
  Report,
  Validation,
  Vote,

  Join,
  EventJoin,
  TeamJoin,

  Subject,
  Tag,
  TeamCategory,

  ActorImage,
  Social,

  OrgDocument,
  OrgMetric,

  Finance,
  Project,
  TeamAction,

  EventApproval,
  EventApprovalStep,

  Session,
  TeachClass,

  Membership,
  CanteenMember,
  ClassGroupMember,
  CohortMember,
  TeamMember,
  TenantMember,

  Role,
  CanteenRole,
  TeamRole,

  Ugc,
  Content,
  ContentEdit,
  TenantDocument,
  DocumentEdit,
  Form,
  FormEdit,
  FormSubmission,
  FormSubmissionEdit,
];

// TODO: add test to match all *.entity.ts files with this list
