import { ActorImage } from './actor/actor-image/actor-image.entity';
import { Actor } from './actor/actor.entity';
import { Social } from './actor/social/social.entity';
import { EventJoin } from './event/event-join/event-join.entity';
import { Event } from './event/event.entity';
import { FormSubmission } from './form/form-submission/form-submission.entity';
import { Form } from './form/form.entity';
import { User } from './user/user.entity';
import { Session } from './user/session/session.entity';
import { Project } from './team/project/project.entity';
import { Action } from './team/action/action.entity';
import { TeamJoin } from './team/team-join/team-join.entity';
import { TeamMember } from './team/team-member/team-member.entity';
import { TeamMemberRole } from './team/team-member-role/team-member-role.entity';
import { Team } from './team/team.entity';
import { EventApprovalStep } from './tenant/event-approval-step/event-approval-step.entity';
import { EventApproval } from './tenant/event-approval/event-approval.entity';
import { Tenant } from './tenant/tenant.entity';
import { FileUpload } from './file-upload/file-upload.entity';
import { Address } from './actor/address/address.entity';
import { BankInfo } from './actor/bank-info/bank-info.entity';
import { Expense } from './team/expense/expense.entity';
import { ExpenseItem } from './team/expense-item/expense-item.entity';
import { Campus } from './tenant/campus/campus.entity';
import { Log } from './log/log.entity';
import { Mission } from './team/mission/mission.entity';
import { MissionJoin } from './team/mission-join/mission-join.entity';
import { EventOrganize } from './event/event-organize/event-organize.entity';
import { LegalUnit } from './actor/legal-unit/legal-unit.entity';
import { Grant } from './team/grant/grant.entity';
import { GrantAllocate } from './team/grant-allocate/grant-allocate.entity';
import { CampusCluster } from './tenant/campus-cluster/campus-cluster.entity';
import { TeamHistory } from './team/team-history/team-history.entity';
import { BankAccount } from './team/bank-account/bank-account.entity';
import { LegalUnitLocation } from './actor/legal-unit-location/legal-unit-location.entity';
import { AdminRole } from './tenant/admin-role/admin-role.entity';
import { EventSupervisor } from './event/event-supervisor/event-supervisor.entity';
import { EventFavorite } from './event/event-favorite/event-favorite.entity';
import { TeamRole } from './team/team-role/team-role.entity';
import { Tag } from './tag/tag.entity';
import { Follow } from './user/follow/follow.entity';
import { Location } from './location/location.entity';
import { TeamDocument } from './team/team-document/team-document.entity';
import { Transaction } from './actor/transaction/transaction.entity';
import { ActorTag } from './actor/actor-tag/actor-tag.entity';
import { TenantMember } from './tenant/tenant-member/tenant-member.entity';
import { TenantMemberRole } from './tenant/tenant-member-role/tenant-member-role.entity';
import { TenantRole } from './tenant/tenant-role/tenant-role.entity';
import { EventApprovalValidator } from './tenant/event-approval-validator/event-approval-validator.entity';
import { RequiredDocument } from './tenant/required-document/required-document.entity';
import { RequiredRole } from './tenant/required-role/required-role.entity';
import { TeamRequiredRole } from './team/team-required-role/team-required-role.entity';

export const allEntities = [
  Actor,
  ActorImage,
  ActorTag,
  Address,
  BankInfo,
  LegalUnit,
  LegalUnitLocation,
  Social,
  Transaction,

  Event,
  EventFavorite,
  EventJoin,
  EventOrganize,
  EventSupervisor,

  Tenant,
  Campus,
  CampusCluster,
  EventApproval,
  EventApprovalStep,
  EventApprovalValidator,
  RequiredDocument,
  RequiredRole,
  TenantMember,
  TenantMemberRole,
  TenantRole,

  Team,
  Action,
  BankAccount,
  Expense,
  ExpenseItem,
  Grant,
  GrantAllocate,
  Mission,
  MissionJoin,
  Project,
  TeamDocument,
  TeamHistory,
  TeamJoin,
  TeamMember,
  TeamMemberRole,
  TeamRequiredRole,
  TeamRole,

  Form,
  FormSubmission,

  User,
  Follow,
  Session,

  FileUpload,
  Location,
  Tag,

  Log,
  AdminRole,
];

// TODO: add test to match all *.entity.ts files with this list
