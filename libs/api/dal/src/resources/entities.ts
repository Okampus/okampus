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
import { ContentEdit } from './content/content-edit/content-edit.entity';
import { ContentMaster } from './content-master/content-master.entity';
import { Content } from './content/content.entity';
import { Favorite } from './content/favorite/favorite.entity';
import { Reaction } from './content/reaction/reaction.entity';
import { Report } from './content/report/report.entity';
import { Validation } from './content/validation/validation.entity';
import { Vote } from './content/vote/vote.entity';
import { DocumentEdit } from './document/document-edit/document-edit.entity';
import { Document } from './document/document.entity';
import { Subject } from './class-group/subject/subject.entity';
import { EventJoin } from './event/event-join/event-join.entity';
import { EventRole } from './event/event-role/event-role.entity';
import { Event } from './event/event.entity';
import { FormSubmissionEdit } from './form-submission/form-submission-edit/form-submission-edit.entity';
import { FormSubmission } from './form-submission/form-submission.entity';
import { FormEdit } from './form/form-edit/form-edit.entity';
import { Form } from './form/form.entity';
import { Individual } from './individual/individual.entity';
import { Session } from './individual/session/session.entity';
import { Shortcut } from './individual/shortcut/shortcut.entity';
import { UserInfo } from './individual/user-info/user-info.entity';
import { ProjectRole } from './project/project-role/project-role.entity';
import { Project } from './project/project.entity';
import { Action } from './team/action/action.entity';
import { TeamFinance } from './team/team-finance/team-finance.entity';
import { TeamJoin } from './team/team-join/team-join.entity';
import { TeamMember } from './team/team-member/team-member.entity';
import { TeamMetric } from './team/team-metric/team-metric.entity';
import { Role } from './team/role/role.entity';
import { Team } from './team/team.entity';
import { EventApprovalStep } from './tenant/event-approval-step/event-approval-step.entity';
import { EventApproval } from './tenant/event-approval/event-approval.entity';
import { Tenant } from './tenant/tenant.entity';
import { Upload } from './upload/upload';
import { BotInfo } from './individual/bot-info/bot-info.entity';
import { ChangeRole } from './team/change-role/change-role.entity';
import { EventChangeRole } from './event/event-change-role/event-change-role.entity';
import { Pole } from './team/pole/pole.entity';
import { ActorAddress } from './actor/actor-address/actor-address.entity';
import { ActorBankInfo } from './actor/actor-bank-info/actor-bank-info.entity';
import { Expense } from './team/expense/expense.entity';
import { ActorFinance } from './actor/actor-finance/actor-finance.entity';
import { Issue } from './content-master/issue/issue.entity';

export const allEntities = [
  Individual,
  BotInfo,
  UserInfo,

  Tenant,

  Actor,
  ActorBankInfo,
  ActorAddress,
  ActorFinance,
  ActorImage,
  Social,
  Tag,

  Session,
  Shortcut,

  Team,
  Action,
  Pole,
  Role,
  ChangeRole,
  Expense,
  TeamFinance,
  TeamJoin,
  TeamMember,
  TeamMetric,

  Canteen,
  CanteenFood,
  CanteenMenu,

  ClassGroup,
  ClassGroupTeacher,

  Cohort,

  Project,
  ProjectRole,

  Event,
  EventJoin,
  EventRole,
  EventChangeRole,

  Upload,

  Favorite,
  Reaction,
  Report,
  Validation,
  Vote,

  EventApproval,
  EventApprovalStep,

  Content,
  ContentEdit,
  ContentMaster,
  Issue,

  Document,
  DocumentEdit,
  Subject,

  Form,
  FormEdit,

  FormSubmission,
  FormSubmissionEdit,
];

// TODO: add test to match all *.entity.ts files with this list
