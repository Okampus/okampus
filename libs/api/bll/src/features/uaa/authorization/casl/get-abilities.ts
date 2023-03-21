import { createMongoAbility as createAbility } from '@casl/ability';
import { AbilityBuilder, ForbiddenError } from '@casl/ability';
import {
  Bot,
  Content,
  DocumentUpload,
  EventApproval,
  EventApprovalStep,
  TenantEvent,
  Favorite,
  Finance,
  Form,
  Individual,
  InfoDocument,
  OrgDocument,
  OrgMetric,
  StudyDocument,
  Subject,
  Tag,
  Team,
  Tenant,
  User,
  TeamJoin,
  FormSubmission,
} from '@okampus/api/dal';
import { Action, IndividualKind, RoleType } from '@okampus/shared/enums';

import type { allEntities, TenantScopedEntity } from '@okampus/api/dal';
import type { MongoAbility as CaslAbility, AnyAbility } from '@casl/ability';
import type { ExtractSubjectType, InferSubjects } from '@casl/ability';

export type Subjects = InferSubjects<(typeof allEntities)[number]> | TenantScopedEntity | 'all';
export type AppAbility = CaslAbility<[action: Action, subjects: Subjects]>;

const errorMessage = (error: ForbiddenError<AnyAbility>) =>
  `You do not have permission to ${error.action.toLowerCase()} a ${error.subjectType.toLowerCase()}`;

// TODO: all this class needs a MAJOR refactor
export function createAbilitiesForIndividual(individual: Individual): AppAbility {
  const { can: allow, cannot: forbid, build } = new AbilityBuilder<AppAbility>(createAbility);

  // TODO: rules for modifying UserImage, TeamImage, App
  // TODO: rules for modifying specific fields of User, Team, etc.

  const isAuthor = { createdBy: { id: individual.id } } as const;
  const isUser = (user: Individual): user is User => user.individualKind === IndividualKind.User;

  allow(Action.Read, 'all');
  allow(Action.Report, 'all');
  allow(Action.Interact, Content);
  forbid(Action.Report, Content, isAuthor).because('Cannot report your own content');

  forbid(Action.Update, Individual).because('Not the individual');
  allow(Action.Update, [Individual, User], { id: individual.id }).because('Is the individual');
  allow(Action.Update, Bot, { owner: { id: individual.id } }).because('Is bot owner');

  if (isUser(individual)) {
    allow(Action.Create, [TeamJoin, FormSubmission]);
    if (individual.roles.includes(RoleType.TenantAdmin)) {
      allow(Action.Manage, 'all');
      allow(Action.Update, 'all');
      allow(Action.Create, 'all');
    } else {
      forbid(Action.Manage, [Tenant, EventApprovalStep]);
      if (individual.roles.includes(RoleType.Moderator)) {
        allow(Action.Manage, [Content, InfoDocument, StudyDocument, Subject, Tag]);
        allow(Action.Update, [Content, InfoDocument, StudyDocument, Subject, Tag]);
      } else {
        forbid(Action.Manage, Content, { lastHiddenAt: null }).because('Content has been removed');
        allow(Action.Update, Content, ['body', 'hidden'], isAuthor).because('Not the author');
        allow([Action.Update, Action.Delete], [StudyDocument, InfoDocument], isAuthor).because('Not the author');
        allow(Action.Delete, Content, isAuthor).because('Not the author');
      }
    }
  } else {
    allow(Action.Create, [DocumentUpload, Content, Favorite, Tag]);
    forbid(Action.Read, [Tenant, OrgMetric]);
    forbid(Action.Manage, [EventApprovalStep, EventApproval, Team, TenantEvent, OrgDocument, Finance, Form]);
  }

  ForbiddenError.setDefaultMessage(errorMessage);
  return build({ detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects> });
}
