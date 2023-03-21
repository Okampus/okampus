import {
  Actor,
  ActorImage,
  Bot,
  Content,
  ContentMaster,
  DocumentEdit,
  DocumentUpload,
  Edit,
  EventApproval,
  EventApprovalStep,
  EventJoin,
  FileUpload,
  Finance,
  Form,
  FormEdit,
  FormSubmission,
  FormSubmissionEdit,
  ImageUpload,
  Individual,
  Join,
  Membership,
  Org,
  OrgDocument,
  Project,
  Role,
  Shortcut,
  Social,
  Tag,
  Team,
  TeamAction,
  TeamCategory,
  TeamJoin,
  TeamMember,
  TeamRole,
  Tenant,
  TenantDocument,
  TenantEvent,
  Ugc,
  User,
  VideoUpload,
} from '@okampus/api/dal';
import { ActorKind, IndividualKind } from '@okampus/shared/enums';
import { loadApplyAsync, applyModelFactory } from '@okampus/api/shards';
import type {
  ITenant,
  ITeam,
  IBot,
  IUser,
  IActor,
  ITenantCore,
  IActorImage,
  ITag,
  IImageUpload,
  ISocial,
  IEventApprovalStep,
  IForm,
  ITeamMember,
  ITeamRole,
  ITeamAction,
  ITenantEvent,
  IEventApproval,
  IContentMaster,
  IContent,
  IFileUpload,
  IBase,
  IDocumentUpload,
  IVideoUpload,
  IIndividual,
  IOrg,
  IRole,
  IMembership,
  IUgc,
  IFormSubmission,
  IJoin,
  IEventJoin,
  ITeamJoin,
  IShortcut,
  IFinance,
  IProject,
  ITeamCategory,
  ITenantDocument,
  IDocumentEdit,
  IOrgDocument,
  ITenantScoped,
  IFormEdit,
  IEdit,
  IFormSubmissionEdit,
} from '@okampus/shared/dtos';

import type { BaseEntity, TenantCore, TenantScopedEntity } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';

export function loadBase(base: BaseEntity): IBase | undefined {
  return applyModelFactory<BaseEntity, IBase>(base, (base) => ({
    id: base.id,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
    deletedAt: base.deletedAt,
  }));
}

export function loadTenantCore(tenant: TenantCore): ITenantCore | undefined {
  const base = loadBase(tenant);
  if (!base) return undefined;

  return {
    ...base,
    name: tenant.name,
    domain: tenant.domain,
    oidcInfo: { ...tenant.oidcInfo },
  };
}

export type AllInterfaces =
  | ITenantCore
  | IActor
  | IActorImage
  | IBot
  | IContent
  | IContentMaster
  | IDocumentEdit
  | IDocumentUpload
  | IEdit
  | IEventApproval
  | IEventApprovalStep
  | IEventJoin
  | IFileUpload
  | IFinance
  | IForm
  | IFormEdit
  | IFormSubmission
  | IFormSubmissionEdit
  | IImageUpload
  | IIndividual
  | IJoin
  | IMembership
  | IOrg
  | IOrgDocument
  | IProject
  | IRole
  | ISocial
  | IShortcut
  | ITag
  | ITeam
  | ITeamAction
  | ITeamCategory
  | ITeamJoin
  | ITeamMember
  | ITeamRole
  | ITenant
  | ITenantDocument
  | ITenantEvent
  | IUgc
  | IUser
  | IVideoUpload
  | ITenantScoped;

export type LoadInterface<T> = T extends Actor
  ? IActor
  : T extends ActorImage
  ? IActorImage
  : T extends Content
  ? IContent
  : T extends TenantEvent
  ? ITenantEvent
  : T extends ContentMaster
  ? IContentMaster
  : T extends DocumentEdit
  ? IDocumentEdit
  : T extends DocumentUpload
  ? IDocumentUpload
  : T extends Edit
  ? IEdit
  : T extends EventApproval
  ? IEventApproval
  : T extends EventApprovalStep
  ? IEventApprovalStep
  : T extends EventJoin
  ? IEventJoin
  : T extends ImageUpload
  ? IImageUpload
  : T extends FileUpload
  ? IFileUpload
  : T extends Finance
  ? IFinance
  : T extends Form
  ? IForm
  : T extends FormEdit
  ? IFormEdit
  : T extends FormSubmission
  ? IFormSubmission
  : T extends FormSubmissionEdit
  ? IFormSubmissionEdit
  : T extends Bot
  ? IBot
  : T extends User
  ? IUser
  : T extends Individual
  ? IIndividual
  : T extends Join
  ? IJoin
  : T extends TeamMember
  ? ITeamMember
  : T extends Membership
  ? IMembership
  : T extends Team
  ? ITeam
  : T extends Tenant
  ? ITenant
  : T extends Org
  ? IOrg
  : T extends TeamAction
  ? ITeamAction
  : T extends OrgDocument
  ? IOrgDocument
  : T extends Project
  ? IProject
  : T extends TeamRole
  ? ITeamRole
  : T extends Role
  ? IRole
  : T extends Shortcut
  ? IShortcut
  : T extends Social
  ? ISocial
  : T extends Tag
  ? ITag
  : T extends TeamCategory
  ? ITeamCategory
  : T extends TeamJoin
  ? ITeamJoin
  : T extends TenantDocument
  ? ITenantDocument
  : T extends Ugc
  ? IUgc
  : T extends VideoUpload
  ? IVideoUpload
  : T extends TenantScopedEntity
  ? ITenantScoped
  : never;

const isTenantCore = (tenantFromStack: AllInterfaces): tenantFromStack is ITenantCore => {
  return !!tenantFromStack;
};

const getTenantOrLoad = (tenant: TenantCore, context: Record<Snowflake, AllInterfaces>): ITenantCore | undefined => {
  const tenantFromStack = context[tenant.id];
  if (isTenantCore(tenantFromStack)) return tenantFromStack;

  const tenantCore = loadTenantCore(tenant);
  if (!tenantCore) return;

  context[tenantCore.id] = tenantCore;
  return tenantCore;
};

export async function getEntityFromStackOrLoad<T extends TenantScopedEntity>(
  entity: T,
  context: Record<Snowflake, AllInterfaces>
): Promise<LoadInterface<T> | undefined>;

export async function getEntityFromStackOrLoad<T extends TenantScopedEntity>(
  entity: T | null,
  context: Record<Snowflake, AllInterfaces>,
  nullable: true
): Promise<LoadInterface<T> | null | undefined>;

export async function getEntityFromStackOrLoad(
  entity: TenantScopedEntity,
  context: Record<Snowflake, AllInterfaces>,
  nullable = false
) {
  if (nullable && !entity) return null;

  const entityFromStack = context[entity.id];
  if (entityFromStack) return entityFromStack;

  const loadedEntity = await loadTenantScopedEntity(entity, context);
  if (!loadedEntity) return;

  context[loadedEntity.id] = loadedEntity;
  return loadedEntity;
}

const isUser = (user: TenantScopedEntity): user is User => (<Individual>user).individualKind === IndividualKind.User;
const isBot = (bot: TenantScopedEntity): bot is Bot => (<Individual>bot).individualKind === IndividualKind.Bot;

export async function loadTenantScopedEntity<T extends TenantScopedEntity>(
  entity: T,
  context: Record<Snowflake, AllInterfaces>,
  loadBaseClass?: boolean
): Promise<LoadInterface<T> | undefined>;

export async function loadTenantScopedEntity(
  entity: TenantScopedEntity,
  context: Record<Snowflake, AllInterfaces>,
  loadBaseClass?: boolean
): Promise<AllInterfaces | undefined> {
  if (entity.id in context) return context[entity.id];

  const baseProps = loadBase(entity);
  if (!baseProps) return undefined;

  const base: ITenantScoped = {
    ...baseProps,
    tenant: entity.tenant ? getTenantOrLoad(entity.tenant, context) : undefined,
    createdBy: entity.createdBy ? await getEntityFromStackOrLoad(entity.createdBy, context) : undefined,
  };

  if (entity instanceof TeamCategory && !loadBaseClass) {
    const baseTag = await loadTenantScopedEntity(entity, context, true);
    if (!baseTag) return undefined;
    return {
      ...baseTag,
      teams: await loadApplyAsync(entity.teams, (team) => getEntityFromStackOrLoad(team, context)),
    };
  }

  if (entity instanceof Tag) {
    return {
      ...base,
      tagKind: entity.tagKind,
      slug: entity.slug,
      iconImage: entity.iconImage ? await loadTenantScopedEntity(entity.iconImage, context) : null,
      color: entity.color,
      name: entity.name,
      description: entity.description,
    };
  }

  if (entity instanceof Social) {
    return {
      ...base,
      type: entity.type,
      url: entity.url,
      pseudo: entity.pseudo,
      actor: await getEntityFromStackOrLoad(entity.actor, context),
    };
  }

  if (entity instanceof ImageUpload && !loadBaseClass) {
    const baseFileUpload = await loadTenantScopedEntity(entity, context, true);
    if (!baseFileUpload) return undefined;
    return {
      ...baseFileUpload,
      width: entity.width,
      height: entity.height,
    };
  }

  if (entity instanceof VideoUpload && !loadBaseClass) {
    const baseFileUpload = await loadTenantScopedEntity(entity, context, true);
    if (!baseFileUpload) return undefined;
    return {
      ...baseFileUpload,
      duration: entity.duration,
      height: entity.height,
      width: entity.width,
    };
  }

  if (entity instanceof DocumentUpload && !loadBaseClass) {
    const baseFileUpload = await loadTenantScopedEntity(entity, context, true);
    if (!baseFileUpload) return undefined;
    return {
      ...baseFileUpload,
      numberOfPages: entity.numberOfPages,
      numberOfWords: entity.numberOfWords,
      documentType: entity.documentType,
    };
  }

  if (entity instanceof FileUpload) {
    return {
      ...base,
      fileUploadKind: entity.fileUploadKind,
      url: entity.url,
      mime: entity.mime,
      name: entity.name,
      size: entity.size,
      lastModifiedAt: entity.lastModifiedAt,
    };
  }

  if (entity instanceof ActorImage) {
    return {
      ...base,
      lastActiveDate: entity.lastActiveDate,
      type: entity.type,
      image: await loadTenantScopedEntity(entity.image, context),
      actor: await getEntityFromStackOrLoad(entity.actor, context),
    };
  }

  if (entity instanceof Shortcut) {
    return {
      ...base,
      type: entity.type,
      targetActor: await getEntityFromStackOrLoad(entity.targetActor, context),
      user: await getEntityFromStackOrLoad(entity.user, context),
    };
  }

  if ((entity instanceof User || isUser(entity)) && !loadBaseClass) {
    const user = await loadTenantScopedEntity(entity, context, true);
    if (!user) return undefined;

    context[user.id] = user;

    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.middleNames = entity.middleNames;
    user.scopeRole = entity.scopeRole;
    user.roles = entity.roles;
    user.customization = entity.customization;
    user.notificationSettings = entity.notificationSettings;
    user.settings = entity.settings;
    user.finishedIntroduction = entity.finishedIntroduction;
    user.finishedOnboarding = entity.finishedOnboarding;
    user.shortcuts = await loadApplyAsync(entity.shortcuts, (shortcut) => loadTenantScopedEntity(shortcut, context));
    user.teamMemberships = await loadApplyAsync(entity.teamMemberships, (member) =>
      loadTenantScopedEntity(member, context)
    );
    user.teamJoins = await loadApplyAsync(entity.teamJoins, (teamJoin) => loadTenantScopedEntity(teamJoin, context));
    user.actor = await getEntityFromStackOrLoad(entity.actor, context);

    return user;
  }

  if ((entity instanceof Bot || isBot(entity)) && !loadBaseClass) {
    const bot = await loadTenantScopedEntity(entity, context, true);
    if (!bot) return undefined;

    context[bot.id] = bot;

    bot.botRole = entity.botRole;
    bot.owner = await loadTenantScopedEntity(entity.owner, context);

    return bot;
  }

  if (entity instanceof Individual) {
    const individual: IIndividual = {
      ...base,
      individualKind: entity.individualKind,
      status: entity.status,
    };

    context[individual.id] = individual;

    individual.actor = await getEntityFromStackOrLoad(entity.actor, context);

    return individual;
  }

  if (entity instanceof Team && !loadBaseClass) {
    const team = await loadTenantScopedEntity(entity, context, true);
    if (!team) return undefined;

    context[team.id] = team;

    team.currentFinance = entity.currentFinance;
    team.type = entity.type;
    team.directorsCategoryName = entity.directorsCategoryName;
    team.managersCategoryName = entity.managersCategoryName;
    team.membersCategoryName = entity.membersCategoryName;
    team.tagline = entity.tagline;
    team.membershipFees = entity.membershipFees;
    team.memberCount = entity.memberCount;
    team.members = await loadApplyAsync(entity.members, (member) => loadTenantScopedEntity(member, context));
    team.roles = await loadApplyAsync(entity.roles, (role) => loadTenantScopedEntity(role, context));
    team.joins = await loadApplyAsync(entity.joins, (join) => loadTenantScopedEntity(join, context));
    team.finances = await loadApplyAsync(entity.finances, (finance) => loadTenantScopedEntity(finance, context));
    team.categories = await loadApplyAsync(entity.categories, (category) => loadTenantScopedEntity(category, context));
    team.joinForm = await getEntityFromStackOrLoad(entity.joinForm, context);

    return team;
  }

  if (entity instanceof Tenant && !loadBaseClass) {
    const tenant = await loadTenantScopedEntity(entity, context, true);
    if (!tenant) return undefined;

    context[tenant.id] = tenant;

    tenant.eventApprovalSteps = await loadApplyAsync(entity.eventApprovalSteps, (approvalStep) =>
      loadTenantScopedEntity(approvalStep, context)
    );

    tenant.eventValidationForm = entity.eventValidationForm
      ? await loadTenantScopedEntity(entity.eventValidationForm, context)
      : null;

    return tenant;
  }

  if (entity instanceof Org) {
    const org: IOrg = {
      ...base,
      orgKind: entity.orgKind,
      documents: [],
    };

    context[org.id] = org;

    org.documents = await loadApplyAsync(entity.documents, (document) => loadTenantScopedEntity(document, context));
    org.events = await loadApplyAsync(entity.events, (event) => getEntityFromStackOrLoad(event, context));
    org.parent = entity.parent ? await loadTenantScopedEntity(entity.parent, context) : null;
    org.actor = await loadTenantScopedEntity(entity.actor, context);

    return org;
  }

  if (entity instanceof Actor) {
    const actor: IActor = {
      ...base,
      actorKind: entity.actorKind(),
      name: entity.name,
      ical: entity.ical,
      bio: entity.bio,
      primaryEmail: entity.primaryEmail,
      slug: entity.slug,
      actorImages: [],
      tags: [],
      socials: [],
    };

    context[actor.id] = actor;

    actor.actorImages = await loadApplyAsync(entity.actorImages, (actorImage) =>
      loadTenantScopedEntity(actorImage, context)
    );
    actor.tags = await loadApplyAsync(entity.tags, (tag) => loadTenantScopedEntity(tag, context));
    actor.socials = await loadApplyAsync(entity.socials, (social) => loadTenantScopedEntity(social, context));

    if (actor.actorKind === ActorKind.Individual && entity.individual) {
      actor.individual = await getEntityFromStackOrLoad(entity.individual, context);
      actor.org = null;
    } else if (actor.actorKind === ActorKind.Org && entity.org) {
      actor.org = await getEntityFromStackOrLoad(entity.org, context);
      actor.individual = null;
    }

    return actor;
  }

  if (entity instanceof OrgDocument) {
    return {
      ...base,
      type: entity.type,
      document: await loadTenantScopedEntity(entity.document, context),
      org: await getEntityFromStackOrLoad(entity.org, context),
    };
  }

  if (entity instanceof TeamRole && !loadBaseClass) {
    const baseRole = await loadTenantScopedEntity(entity, context, true);
    if (!baseRole) return undefined;

    return {
      ...baseRole,
      permissions: entity.permissions,
      category: entity.category,
      key: entity.key,
      team: await getEntityFromStackOrLoad(entity.team, context),
    };
  }

  if (entity instanceof Role) {
    return {
      ...base,
      roleKind: entity.roleKind,
      color: entity.color,
      required: entity.required,
      name: entity.name,
    };
  }

  if (entity instanceof TeamMember && !loadBaseClass) {
    const baseMember = await loadTenantScopedEntity(entity, context, true);
    if (!baseMember) return undefined;

    return {
      ...baseMember,
      team: await getEntityFromStackOrLoad(entity.team, context),
      roles: await loadApplyAsync(entity.roles, (role) => loadTenantScopedEntity(role, context)),
      activities: await loadApplyAsync(entity.activities, (activity) => loadTenantScopedEntity(activity, context)),
    };
  }

  if (entity instanceof Membership) {
    return {
      ...base,
      membershipKind: entity.membershipKind,
      startDate: entity.startDate,
      endDate: entity.endDate,
      user: await getEntityFromStackOrLoad(entity.user, context),
    };
  }

  if (entity instanceof TeamAction) {
    return {
      ...base,
      name: entity.name,
      score: entity.score,
      description: entity.description,
      team: await getEntityFromStackOrLoad(entity.team, context),
      user: await getEntityFromStackOrLoad(entity.user, context),
      teamMember: await getEntityFromStackOrLoad(entity.teamMember, context, true),
      state: entity.state,
    };
  }

  if (entity instanceof Project) {
    return {
      ...base,
      name: entity.name,
      description: entity.description,
      expectedBudget: entity.expectedBudget,
      actualBudget: entity.actualBudget,
      team: await getEntityFromStackOrLoad(entity.team, context),
      linkedEvent: entity.linkedEvent ? await loadTenantScopedEntity(entity.linkedEvent, context) : null,
      participants: await loadApplyAsync(entity.participants, (participant) =>
        getEntityFromStackOrLoad(participant, context)
      ),
    };
  }

  if (entity instanceof Finance) {
    return {
      ...base,
      transaction: entity.transaction,
      description: entity.description,
      address: entity.address,
      amountDue: entity.amountDue,
      amountPayed: entity.amountPayed,
      category: entity.category,
      paymentDate: entity.paymentDate,
      paymentMethod: entity.paymentMethod,
      state: entity.state,
      linkedEvent: entity.linkedEvent ? await loadTenantScopedEntity(entity.linkedEvent, context) : null,
      linkedProject: entity.linkedProject ? await loadTenantScopedEntity(entity.linkedProject, context) : null,
      receipts: await loadApplyAsync(entity.receipts, (receipt) => loadTenantScopedEntity(receipt, context)),
      team: await getEntityFromStackOrLoad(entity.team, context),
    };
  }

  if (entity instanceof TenantEvent && !loadBaseClass) {
    const event = await loadTenantScopedEntity(entity, context, true);
    if (!event) return undefined;

    context[entity.id] = event;

    event.start = entity.start;
    event.end = entity.end;
    event.title = entity.title;
    event.state = entity.state;
    event.location = { ...entity.location };
    event.meta = entity.meta;
    event.price = entity.price;
    event.private = entity.private;
    event.regularEventInterval = entity.regularEventInterval;
    event.regularEvent = entity.regularEvent ? await loadTenantScopedEntity(entity.regularEvent, context) : null;
    event.supervisor = await getEntityFromStackOrLoad(entity.supervisor, context);
    event.orgs = await loadApplyAsync(entity.orgs, (org) => getEntityFromStackOrLoad(org, context));
    event.eventApprovals = await loadApplyAsync(entity.eventApprovals, (approval) =>
      loadTenantScopedEntity(approval, context)
    );
    event.registrations = await loadApplyAsync(entity.registrations, (registration) =>
      loadTenantScopedEntity(registration, context)
    );

    return event;
  }

  if (entity instanceof ContentMaster) {
    const contentMaster = await loadTenantScopedEntity(entity, context, true);
    if (!contentMaster) return undefined;

    context[entity.id] = contentMaster;

    contentMaster.contentMasterKind = entity.contentMasterKind;
    contentMaster.slug = entity.slug;
    contentMaster.title = entity.title;
    contentMaster.tags = await loadApplyAsync(entity.tags, (tag) => loadTenantScopedEntity(tag, context));
    contentMaster.contributors = await loadApplyAsync(entity.contributors, (contributor) =>
      getEntityFromStackOrLoad(contributor, context)
    );
    contentMaster.rootContent = await getEntityFromStackOrLoad(entity.rootContent, context);

    return contentMaster;
  }

  if (entity instanceof TeamJoin && !loadBaseClass) {
    const baseJoin = await loadTenantScopedEntity(entity, context, true);
    if (!baseJoin) return undefined;

    return {
      ...baseJoin,
      askedRole: await loadTenantScopedEntity(entity.askedRole, context),
      team: await getEntityFromStackOrLoad(entity.team, context),
      receivedRole: entity.receivedRole ? await loadTenantScopedEntity(entity.receivedRole, context) : null,
    };
  }

  if (entity instanceof EventJoin && !loadBaseClass) {
    const baseJoin = await loadTenantScopedEntity(entity, context, true);
    if (!baseJoin) return undefined;

    return {
      ...baseJoin,
      linkedEvent: await loadTenantScopedEntity(entity.event, context),
      presenceStatus: entity.presenceStatus,
      participated: entity.participated,
      teamAction: entity.teamAction ? await loadTenantScopedEntity(entity.teamAction, context) : null,
    };
  }

  if (entity instanceof Join) {
    return {
      ...base,
      formSubmission: entity.formSubmission ? await loadTenantScopedEntity(entity.formSubmission, context) : null,
      joinKind: entity.joinKind,
      joiner: await getEntityFromStackOrLoad(entity.joiner, context),
      state: entity.state,
      settledAt: entity.settledAt,
      settledMessage: entity.settledMessage,
      settledBy: await getEntityFromStackOrLoad(entity.settledBy, context, true),
    };
  }

  if (entity instanceof TenantDocument && !loadBaseClass) {
    const baseUgc = await loadTenantScopedEntity(entity, context, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      name: entity.name,
      yearVersion: entity.yearVersion,
      current: await loadTenantScopedEntity(entity.newVersion, context),
    };
  }

  if (entity instanceof DocumentEdit && !loadBaseClass) {
    return {
      ...base,
      yearVersion: entity.yearVersion,
      current: await loadTenantScopedEntity(entity.newVersion, context),
    };
  }

  if (entity instanceof Form && !loadBaseClass) {
    const baseUgc = await loadTenantScopedEntity(entity, context, true);
    if (!baseUgc) return undefined;

    const form: IForm = {
      ...baseUgc,
      name: entity.name,
      type: entity.type,
      schema: entity.schema,
      description: entity.description,
      isTemplate: entity.isTemplate,
      undeletable: entity.undeletable,
    };

    context[entity.id] = form;

    return form;
  }

  if (entity instanceof FormEdit && !loadBaseClass) {
    return {
      ...base,
      addedDiff: entity.addedDiff,
      newVersion: entity.newVersion,
    };
  }

  if (entity instanceof FormSubmission && !loadBaseClass) {
    const baseUgc = await loadTenantScopedEntity(entity, context, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      newVersion: entity.submission,
    };
  }

  if (entity instanceof FormSubmissionEdit && !loadBaseClass) {
    return {
      ...base,
      addedDiff: entity.addedDiff,
    };
  }

  if (entity instanceof Content && !loadBaseClass) {
    const baseUgc = await loadTenantScopedEntity(entity, context, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      parent: entity.parent ? await loadTenantScopedEntity(entity, context) : null,
      attachments: await loadApplyAsync(entity.attachments, (attachment) =>
        loadTenantScopedEntity(attachment, context)
      ),
    };
  }

  if (entity instanceof Edit) {
    return {
      ...base,
      editKind: entity.editKind,
      addedDiff: entity.addedDiff,
      linkedUgc: await loadTenantScopedEntity(entity.linkedUgc, context),
    };
  }

  if (entity instanceof Ugc) {
    // const [lastEditEntity] = await entity.edits.matching({ limit: 1, orderBy: { createdAt: 'desc' } });
    return {
      ...base,
      ugcKind: entity.ugcKind,
      description: entity.description,
      isAnonymous: entity.isAnonymous,
      contentMaster: await getEntityFromStackOrLoad(entity.contentMaster, context, true),
      author: await getEntityFromStackOrLoad(entity.author, context, true),
      representingOrgs: await loadApplyAsync(entity.representingOrgs, (org) => getEntityFromStackOrLoad(org, context)),
      edits: await loadApplyAsync(entity.edits, (edit) => loadTenantScopedEntity(edit, context)),
      // lastEdit: lastEditEntity ? await loadTenantScopedEntity(lastEditEntity, context) : null,
    };
  }

  if (entity instanceof EventApproval) {
    return {
      ...base,
      approved: entity.approved,
      message: entity.message,
      step: await loadTenantScopedEntity(entity.step, context),
      linkedEvent: await loadTenantScopedEntity(entity.event, context),
    };
  }

  if (entity instanceof EventApprovalStep) {
    return {
      ...base,
      stepOrder: entity.stepOrder,
      name: entity.name,
      notifiees: await loadApplyAsync(entity.notifiees, (notifiee) => getEntityFromStackOrLoad(notifiee, context)),
      validators: await loadApplyAsync(entity.validators, (validator) => getEntityFromStackOrLoad(validator, context)),
      linkedTenant: await getEntityFromStackOrLoad(entity.linkedTenant, context),
    };
  }

  throw new Error(`Unknown entity type ${entity.constructor.name}`);
}
