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
  Report,
  StudyDocument,
  Subject,
  Tag,
  Team,
  Tenant
} from '@okampus/api/dal';
import { Action, IndividualKind, RoleType } from '@okampus/shared/enums';
import type {
  allEntities,
  User} from '@okampus/api/dal';
import type { MongoAbility as CaslAbility} from '@casl/ability';
import type { ExtractSubjectType, InferSubjects } from '@casl/ability';

export type Subjects = InferSubjects<(typeof allEntities)[number]> | 'all';
export type AppAbility = CaslAbility<[action: Action, subjects: Subjects]>;

// TODO: all this class needs a MAJOR refactor
export function createAbilitiesForIndividual(individual: Individual): AppAbility {
  const { can: allow, cannot: forbid, build } = new AbilityBuilder<AppAbility>(createAbility);

  // TODO: rules for modifying UserImage, TeamImage, App
  // TODO: rules for modifying specific fields of User, Team, etc.

  const isAuthor = { realAuthor: { id: individual.id } } as const;

  if (individual.individualKind === IndividualKind.User && (individual as User).roles.includes(RoleType.TenantAdmin)) {
    allow(Action.Read, 'all');
    allow(Action.Manage, 'all');
    allow(Action.Create, 'all');
  } else {
    allow(Action.Read, 'all');
    forbid(Action.Read, [
      Tenant,
      Report,
      OrgMetric,
      //Announcement,
    ]);

    forbid(Action.Manage, [EventApprovalStep, EventApproval]);

    allow([Action.Read, Action.Update], Report, { actor: { id: individual.id } });

    // allow(Action.Read, Announcement, {
    //   state: AnnouncementState.Committed,
    //   displayFrom: { $lte: new Date() },
    // });

    allow(Action.Create, [
      DocumentUpload,
      Content,
      Favorite,
      Tag,
      // Thread,
    ]);
    allow(Action.Report, 'all');
    forbid(Action.Report, Content, isAuthor).because('Cannot report your own content');
    allow(Action.Interact, Content);

    // This is all managed manually inside the services.
    allow(Action.Manage, [Team, TenantEvent, OrgDocument, Finance, Form]);

    forbid(Action.Update, Individual).because('Not the individual');
    allow(Action.Update, Individual, { id: individual.id }).because('Is the individual');
    allow(Action.Update, Bot, { owner: { id: individual.id } }).because('Is bot owner');

    if (individual.individualKind === IndividualKind.User && (individual as User).roles.includes(RoleType.Moderator)) {
      allow(Action.Read, 'all');
      allow(Action.Update, 'all');
      forbid(Action.Update, [
        EventApproval,
        // Badge,
      ]);
      forbid(Action.Manage, [Tenant, EventApprovalStep]);
      allow(Action.Manage, [
        Content,
        InfoDocument,
        StudyDocument,
        Report,
        Subject,
        Tag,
        // Announcement,
        // Blog,
        // Thread,
        // Wiki,
      ]);
    } else {
      forbid(Action.Manage, Content, { lastHiddenAt: null }).because('Content has been removed');
      allow(Action.Update, Content, ['body', 'hidden'], isAuthor).because('Not the author');
      allow(Action.Delete, Content, isAuthor).because('Not the author');

      // forbid(Action.Manage, [Blog, Thread], {
      //   'post.isVisible': false,
      // }).because('Content has been removed');
      // forbid(Action.Manage, Wiki, { hidden: true }).because('Content has been removed');
      // forbid(Action.Manage, [Attachment, Favorite, Report], {
      //   'content.isVisible': false,
      // }).because('Content has been removed');

      // allow(Action.Update, Thread, ['opValidated', 'tags', 'title', 'type'], isAuthor).because('Not the author');

      allow([Action.Update, Action.Delete], [StudyDocument, InfoDocument], isAuthor).because('Not the author');

      // forbid([Action.Update, Action.Delete, Action.Interact], Thread, {
      //   locked: true,
      // }).because('Thread is locked');

      // TODO: create lock entity
      // forbid(
      //   [Action.Create, Action.Update, Action.Delete, Action.Interact],
      //   Content,
      //   { 'contentMaster.locked': true }
      // ).because('Thread is locked');
    }

    // if (individual.roles.includes(Role.CafeteriaManager)) allow(Action.Manage, [Menu, Food]);

    // if (individual.roles.includes(Role.ClubManager)) {
    //   allow(Action.Manage, Team, isClub);
    //   allow(Action.Manage, [Event, TeamFile], { 'team.kind': TeamKind.Club });
    //   allow(Action.Manage, [Metric, Tenant, ApprovalStep, EventApproval]);
    // }
  }

  ForbiddenError.setDefaultMessage(
    (error) => `You do not have permission to ${error.action.toLowerCase()} a ${error.subjectType.toLowerCase()}`
  );

  return build({
    detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
  });
}
