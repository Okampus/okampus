import { ActorImage } from './actor/actor-image/actor-image.entity';
import { Actor } from './actor/actor.entity';
import { Social } from './actor/social/social.entity';
import { Tag } from './actor/tag/tag.entity';
import { CanteenFood } from './canteen/canteen-food/canteen-food.entity';
import { CanteenMenu } from './canteen/canteen-menu/canteen-menu.entity';
import { Canteen } from './canteen/canteen.entity';
import { ClassGroupTeacher } from './class-group/class-group-teacher/class-group-teacher.entity';
import { ClassGroup } from './class-group/class-group.entity';
import { Cohort } from './cohort/cohort.entity';
import { Thread } from './thread/thread.entity';
import { Content } from './content/content.entity';
import { Favorite } from './content/favorite/favorite.entity';
import { Reaction } from './content/reaction/reaction.entity';
import { Report } from './content/report/report.entity';
import { Validation } from './content/validation/validation.entity';
import { Vote } from './content/vote/vote.entity';
import { Document } from './document/document.entity';
import { Subject } from './class-group/subject/subject.entity';
import { EventJoin } from './event/event-join/event-join.entity';
import { Event } from './event/event.entity';
import { FormSubmission } from './form-submission/form-submission.entity';
import { Form } from './form/form.entity';
import { Individual } from './individual/individual.entity';
import { Session } from './individual/session/session.entity';
import { Shortcut } from './individual/shortcut/shortcut.entity';
import { User } from './individual/user/user.entity';
import { Project } from './project/project.entity';
import { Action } from './team/action/action.entity';
import { Finance } from './team/finance/finance.entity';
import { TeamJoin } from './team/team-join/team-join.entity';
import { TeamMember } from './team/team-member/team-member.entity';
import { TeamMetric } from './team/team-metric/team-metric.entity';
import { Role } from './team/role/role.entity';
import { Team } from './team/team.entity';
import { EventApprovalStep } from './tenant/event-approval-step/event-approval-step.entity';
import { EventApproval } from './tenant/event-approval/event-approval.entity';
import { Tenant } from './tenant/tenant.entity';
import { FileUpload } from './file-upload/file-upload.entity';
import { Bot } from './individual/bot/bot.entity';
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
import { EventManage } from './event/event-manage/event-manage.entity';
import { Issue } from './issue/issue.entity';
import { LegalUnit } from './actor/legal-unit/legal-unit.entity';
import { Grant } from './team/grant/grant.entity';
import { GrantAllocate } from './team/grant-allocate/grant-allocate.entity';
import { CampusCluster } from './tenant/campus-cluster/campus-cluster.entity';
import { TenantManage } from './tenant/tenant-manage/tenant-manage.entity';
import { TeamHistory } from './team/team-history/team-history.entity';
import { Account } from './team/account/account.entity';
import { LegalUnitLocation } from './actor/legal-unit-location/legal-unit-location.entity';
import { Location } from './actor/location/location.entity';
import { AdminRole } from './tenant/admin-role/admin-role.entity';

export const allEntities = [
  Log,
  AdminRole,

  Individual,
  Bot,
  User,

  Tenant,
  TenantManage,
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

  Account,
  Expense,
  ExpenseItem,

  Finance,
  TeamJoin,
  TeamMember,
  TeamMetric,

  Grant,
  GrantAllocate,

  Canteen,
  CanteenFood,
  CanteenMenu,

  ClassGroup,
  ClassGroupTeacher,

  Cohort,

  Project,

  Event,
  EventManage,
  EventJoin,

  FileUpload,

  Favorite,
  Reaction,
  Report,
  Validation,
  Vote,

  EventApproval,
  EventApprovalStep,

  Content,
  Thread,
  Issue,

  Document,
  Subject,

  Form,
  FormSubmission,
];

// TODO: add test to match all *.entity.ts files with this list
