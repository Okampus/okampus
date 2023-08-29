import { ActorImage } from './actor/actor-image/actor-image.entity';
import { Actor } from './actor/actor.entity';
import { Social } from './actor/social/social.entity';
import { Tag } from './actor/tag/tag.entity';
import { Document } from './team/document/document.entity';
import { EventJoin } from './event/event-join/event-join.entity';
import { Event } from './event/event.entity';
import { FormSubmission } from './form/form-submission/form-submission.entity';
import { Form } from './form/form.entity';
import { User } from './user/user.entity';
import { Session } from './user/session/session.entity';
import { Shortcut } from './user/shortcut/shortcut.entity';
import { Project } from './team/project/project.entity';
import { Action } from './team/action/action.entity';
import { Finance } from './team/finance/finance.entity';
import { TeamJoin } from './team/team-join/team-join.entity';
import { TeamMember } from './team/team-member/team-member.entity';
import { Role } from './team/role/role.entity';
import { TeamMemberRole } from './team/team-member-role/team-member-role.entity';
import { Team } from './team/team.entity';
import { EventApprovalStep } from './tenant/event-approval-step/event-approval-step.entity';
import { EventApproval } from './tenant/event-approval/event-approval.entity';
import { Tenant } from './tenant/tenant.entity';
import { FileUpload } from './file-upload/file-upload.entity';
import { Pole } from './team/pole/pole.entity';
import { Address } from './actor/address/address.entity';
import { BankInfo } from './actor/bank-info/bank-info.entity';
import { Expense } from './team/expense/expense.entity';
import { ExpenseItem } from './team/expense-item/expense-item.entity';
import { Campus } from './tenant/campus/campus.entity';
import { Follow } from './actor/follow/follow.entity';
import { Log } from './log/log.entity';
import { Mission } from './team/mission/mission.entity';
import { MissionJoin } from './team/mission-join/mission-join.entity';
import { EventOrganize } from './event/event-organize/event-organize.entity';
import { LegalUnit } from './actor/legal-unit/legal-unit.entity';
import { Grant } from './team/grant/grant.entity';
import { GrantAllocate } from './team/grant-allocate/grant-allocate.entity';
import { CampusCluster } from './tenant/campus-cluster/campus-cluster.entity';
import { TenantOrganize } from './tenant/tenant-organize/tenant-organize.entity';
import { TeamHistory } from './team/team-history/team-history.entity';
import { BankAccount } from './team/bank-account/bank-account.entity';
import { LegalUnitLocation } from './actor/legal-unit-location/legal-unit-location.entity';
import { Location } from './actor/location/location.entity';
import { AdminRole } from './tenant/admin-role/admin-role.entity';
import { EventSupervisor } from './event/event-supervisor/event-supervisor.entity';
import { EventFavorite } from './event/event-favorite/event-favorite.entity';

export const allEntities = [
  Log,
  AdminRole,

  User,

  Tenant,
  TenantOrganize,
  Campus,
  CampusCluster,

  Actor,
  BankInfo,
  Address,
  Location,
  ActorImage,
  LegalUnit,
  LegalUnitLocation,

  Social,
  Tag,
  Follow,

  Session,
  Shortcut,

  Team,
  TeamHistory,
  Action,
  Mission,
  MissionJoin,

  Pole,
  Role,
  TeamMemberRole,

  BankAccount,
  Expense,
  ExpenseItem,

  Finance,
  TeamJoin,
  TeamMember,

  Grant,
  GrantAllocate,

  Project,

  Event,
  EventApproval,
  EventApprovalStep,
  EventFavorite,
  EventJoin,
  EventOrganize,
  EventSupervisor,

  FileUpload,

  Form,
  FormSubmission,

  Document,
];

// TODO: add test to match all *.entity.ts files with this list
