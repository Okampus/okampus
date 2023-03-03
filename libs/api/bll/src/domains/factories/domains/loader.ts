import {
  Actor,
  ActorImage,
  Bot,
  Content,
  ContentMaster,
  DocumentEdit,
  DocumentUpload,
  EventApproval,
  EventApprovalStep,
  EventJoin,
  FileUpload,
  Finance,
  Form,
  FormSubmission,
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
  UserProfile,
  VideoUpload,
} from '@okampus/api/dal';
import { ActorKind, IndividualKind } from '@okampus/shared/enums';
import { loadApply, applyModelFactory } from '@okampus/api/shards';
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
  IUserProfile,
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

// REFACTOR ALL THE ABOVE CODE INTO ONE FUNCTION

export type AllInterfaces =
  | ITenantCore
  | IActor
  | IActorImage
  | IBot
  | IContent
  | IContentMaster
  | IDocumentEdit
  | IDocumentUpload
  | IEventApproval
  | IEventApprovalStep
  | IEventJoin
  | IFileUpload
  | IFinance
  | IForm
  | IFormSubmission
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
  | IUserProfile
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
  : T extends FormSubmission
  ? IFormSubmission
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
  : T extends UserProfile
  ? IUserProfile
  : T extends VideoUpload
  ? IVideoUpload
  : T extends TenantScopedEntity
  ? ITenantScoped
  : never;

const isTenantCore = (tenantFromStack: AllInterfaces): tenantFromStack is ITenantCore => {
  return !!tenantFromStack;
};

const getTenantOrLoad = (
  tenant: TenantCore,
  contextStack: Record<Snowflake, AllInterfaces>
): ITenantCore | undefined => {
  const tenantFromStack = contextStack[tenant.id];
  if (isTenantCore(tenantFromStack)) return tenantFromStack;

  const tenantCore = loadTenantCore(tenant);
  if (!tenantCore) return;

  contextStack[tenantCore.id] = tenantCore;
  return tenantCore;
};

export function getEntityFromStackOrLoad<T extends TenantScopedEntity>(
  entity: T,
  contextStack: Record<Snowflake, AllInterfaces>
): LoadInterface<T> | undefined;

export function getEntityFromStackOrLoad<T extends TenantScopedEntity>(
  entity: T | null,
  contextStack: Record<Snowflake, AllInterfaces>,
  nullable: true
): LoadInterface<T> | null | undefined;

export function getEntityFromStackOrLoad(
  entity: TenantScopedEntity,
  contextStack: Record<Snowflake, AllInterfaces>,
  nullable = false
) {
  if (nullable && !entity) return null;

  const entityFromStack = contextStack[entity.id];
  if (entityFromStack) return entityFromStack;

  const loadedEntity = loadTenantScopedEntity(entity, contextStack);
  if (!loadedEntity) return;

  contextStack[loadedEntity.id] = loadedEntity;
  return loadedEntity;
}

const isUser = (user: TenantScopedEntity): user is User => (<Individual>user).individualKind === IndividualKind.User;
const isBot = (bot: TenantScopedEntity): bot is Bot => (<Individual>bot).individualKind === IndividualKind.Bot;

export function loadTenantScopedEntity<T extends TenantScopedEntity>(
  entity: T,
  contextStack: Record<Snowflake, AllInterfaces>,
  loadBaseClass?: boolean
): LoadInterface<T> | undefined;

export function loadTenantScopedEntity(
  entity: TenantScopedEntity,
  contextStack: Record<Snowflake, AllInterfaces>,
  loadBaseClass?: boolean
): AllInterfaces | undefined {
  const base = loadBase(entity);
  if (!base) return undefined;

  const tenant = getTenantOrLoad(entity.tenant, contextStack);

  if (entity instanceof TeamCategory && !loadBaseClass) {
    const baseTag = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseTag) return undefined;
    return {
      ...baseTag,
      teams: loadApply(entity.teams, (team) => getEntityFromStackOrLoad(team, contextStack)),
    };
  }

  if (entity instanceof Tag) {
    return {
      ...base,
      tagKind: entity.tagKind,
      slug: entity.slug,
      iconImage: entity.iconImage ? loadTenantScopedEntity(entity.iconImage, contextStack) : null,
      color: entity.color,
      name: entity.name,
      description: entity.description,
      tenant,
    };
  }

  if (entity instanceof Social) {
    return {
      ...base,
      type: entity.type,
      url: entity.url,
      pseudo: entity.pseudo,
      actor: getEntityFromStackOrLoad(entity.actor, contextStack),
      tenant,
    };
  }

  if (entity instanceof ImageUpload && !loadBaseClass) {
    const baseFileUpload = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseFileUpload) return undefined;
    return {
      ...baseFileUpload,
      width: entity.width,
      height: entity.height,
    };
  }

  if (entity instanceof VideoUpload && !loadBaseClass) {
    const baseFileUpload = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseFileUpload) return undefined;
    return {
      ...baseFileUpload,
      duration: entity.duration,
      height: entity.height,
      width: entity.width,
    };
  }

  if (entity instanceof DocumentUpload && !loadBaseClass) {
    const baseFileUpload = loadTenantScopedEntity(entity, contextStack, true);
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
      tenant,
    };
  }

  if (entity instanceof ActorImage) {
    return {
      ...base,
      lastActiveDate: entity.lastActiveDate,
      type: entity.type,
      image: loadTenantScopedEntity(entity.image, contextStack),
      actor: getEntityFromStackOrLoad(entity.actor, contextStack),
      tenant,
    };
  }

  if (entity instanceof Shortcut) {
    return {
      ...base,
      type: entity.type,
      targetActor: getEntityFromStackOrLoad(entity.targetActor, contextStack),
      user: getEntityFromStackOrLoad(entity.user, contextStack),
      tenant,
    };
  }

  if (entity instanceof UserProfile) {
    return {
      ...base,
      customization: { ...entity.customization },
      settings: { ...entity.settings },
      stats: { ...entity.stats },
      notificationSettings: { ...entity.notificationSettings },
      finishedIntroduction: entity.finishedIntroduction,
      finishedOnboarding: entity.finishedOnboarding,
      tenant,
    };
  }

  if ((entity instanceof User || isUser(entity)) && !loadBaseClass) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const user = loadTenantScopedEntity(entity, contextStack, true);
    if (!user) return undefined;

    contextStack[user.id] = user;

    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.middleNames = entity.middleNames;
    user.scopeRole = entity.scopeRole;
    user.roles = entity.roles;
    user.shortcuts = loadApply(entity.shortcuts, (shortcut) => loadTenantScopedEntity(shortcut, contextStack));
    user.teamMemberships = loadApply(entity.teamMemberships, (member) => loadTenantScopedEntity(member, contextStack));
    user.profile = loadTenantScopedEntity(entity.profile, contextStack);
    user.actor = getEntityFromStackOrLoad(entity.actor, contextStack);

    return user;
  }

  if ((entity instanceof Bot || isBot(entity)) && !loadBaseClass) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const bot = loadTenantScopedEntity(entity, contextStack, true);
    if (!bot) return undefined;

    contextStack[bot.id] = bot;

    bot.botRole = entity.botRole;
    bot.owner = loadTenantScopedEntity(entity.owner, contextStack);

    return bot;
  }

  if (entity instanceof Individual) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const individual: IIndividual = {
      ...base,
      individualKind: entity.individualKind,
      tenant,
    };

    contextStack[individual.id] = individual;
    individual.actor = getEntityFromStackOrLoad(entity.actor, contextStack);

    return individual;
  }

  if (entity instanceof Team && !loadBaseClass) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const team = loadTenantScopedEntity(entity, contextStack, true);
    if (!team) return undefined;

    contextStack[team.id] = team;

    team.currentFinance = entity.currentFinance;
    team.type = entity.type;
    team.directorsCategoryName = entity.directorsCategoryName;
    team.managersCategoryName = entity.membersCategoryName;
    team.membersCategoryName = entity.membersCategoryName;
    team.tagline = entity.tagline;
    team.membershipFees = entity.membershipFees;
    team.memberCount = entity.memberCount;
    team.members = loadApply(entity.members, (member) => loadTenantScopedEntity(member, contextStack));
    team.roles = loadApply(entity.roles, (role) => loadTenantScopedEntity(role, contextStack));
    team.finances = loadApply(entity.finances, (finance) => loadTenantScopedEntity(finance, contextStack));
    team.categories = loadApply(entity.categories, (category) => loadTenantScopedEntity(category, contextStack));
    team.joinForm = entity.joinForm ? loadTenantScopedEntity(entity.joinForm, contextStack) : null;

    return team;
  }

  if (entity instanceof Tenant && !loadBaseClass) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const tenant = loadTenantScopedEntity(entity, contextStack, true);
    if (!tenant) return undefined;

    contextStack[tenant.id] = tenant;

    tenant.eventApprovalSteps = loadApply(entity.eventApprovalSteps, (approvalStep) =>
      loadTenantScopedEntity(approvalStep, contextStack)
    );

    tenant.eventValidationForm = entity.eventValidationForm
      ? loadTenantScopedEntity(entity.eventValidationForm, contextStack)
      : null;

    return tenant;
  }

  if (entity instanceof Org) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const org: IOrg = {
      ...base,
      orgKind: entity.orgKind,
      documents: [],
      tenant,
    };

    contextStack[org.id] = org;

    org.documents = loadApply(entity.documents, (document) => loadTenantScopedEntity(document, contextStack));
    org.parent = entity.parent ? loadTenantScopedEntity(entity.parent, contextStack) : null;
    org.actor = loadTenantScopedEntity(entity.actor, contextStack);

    return org;
  }

  if (entity instanceof Actor) {
    if (entity.id in contextStack) return contextStack[entity.id];

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
      tenant,
    };

    contextStack[actor.id] = actor;

    actor.actorImages = loadApply(entity.actorImages, (actorImage) => loadTenantScopedEntity(actorImage, contextStack));
    actor.tags = loadApply(entity.tags, (tag) => loadTenantScopedEntity(tag, contextStack));
    actor.socials = loadApply(entity.socials, (social) => loadTenantScopedEntity(social, contextStack));

    if (actor.actorKind === ActorKind.Individual && entity.individual) {
      actor.individual = getEntityFromStackOrLoad(entity.individual, contextStack);
      actor.org = null;
    } else if (actor.actorKind === ActorKind.Org && entity.org) {
      actor.org = getEntityFromStackOrLoad(entity.org, contextStack);
      actor.individual = null;
    }

    return actor;
  }

  if (entity instanceof OrgDocument) {
    return {
      ...base,
      type: entity.type,
      document: loadTenantScopedEntity(entity.document, contextStack),
      org: getEntityFromStackOrLoad(entity.org, contextStack),
      tenant: loadTenantCore(entity.tenant),
    };
  }

  if (entity instanceof TeamRole && !loadBaseClass) {
    const baseRole = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseRole) return undefined;

    return {
      ...baseRole,
      permissions: entity.permissions,
      category: entity.category,
      key: entity.key,
      tenant,
      team: getEntityFromStackOrLoad(entity.team, contextStack),
    };
  }

  if (entity instanceof Role) {
    return {
      ...base,
      roleKind: entity.roleKind,
      color: entity.color,
      required: entity.required,
      name: entity.name,
      tenant,
    };
  }

  if (entity instanceof TeamMember && !loadBaseClass) {
    const baseMember = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseMember) return undefined;

    return {
      ...baseMember,
      team: getEntityFromStackOrLoad(entity.team, contextStack),
      roles: loadApply(entity.roles, (role) => loadTenantScopedEntity(role, contextStack)),
      activities: loadApply(entity.activities, (activity) => loadTenantScopedEntity(activity, contextStack)),
    };
  }

  if (entity instanceof Membership) {
    return {
      ...base,
      user: getEntityFromStackOrLoad(entity.user, contextStack),
      membershipKind: entity.membershipKind,
      startDate: entity.startDate,
      endDate: entity.endDate,
      tenant,
    };
  }

  if (entity instanceof TeamAction) {
    return {
      ...base,
      name: entity.name,
      score: entity.score,
      description: entity.description,
      team: getEntityFromStackOrLoad(entity.team, contextStack),
      user: getEntityFromStackOrLoad(entity.user, contextStack),
      teamMember: getEntityFromStackOrLoad(entity.teamMember, contextStack, true),
      state: entity.state,
      tenant,
    };
  }

  if (entity instanceof Project) {
    return {
      ...base,
      name: entity.name,
      description: entity.description,
      expectedBudget: entity.expectedBudget,
      actualBudget: entity.actualBudget,
      team: getEntityFromStackOrLoad(entity.team, contextStack),
      linkedEvent: entity.linkedEvent ? loadTenantScopedEntity(entity.linkedEvent, contextStack) : null,
      createdBy: loadTenantScopedEntity(entity.createdBy, contextStack),
      participants: loadApply(entity.participants, (participant) =>
        getEntityFromStackOrLoad(participant, contextStack)
      ),
      tenant,
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
      createdBy: getEntityFromStackOrLoad(entity.createdBy, contextStack),
      linkedEvent: entity.linkedEvent ? loadTenantScopedEntity(entity.linkedEvent, contextStack) : null,
      linkedProject: entity.linkedProject ? loadTenantScopedEntity(entity.linkedProject, contextStack) : null,
      receipts: loadApply(entity.receipts, (receipt) => loadTenantScopedEntity(receipt, contextStack)),
      team: getEntityFromStackOrLoad(entity.team, contextStack),
      tenant,
    };
  }

  if (entity instanceof TenantEvent && !loadBaseClass) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const event = loadTenantScopedEntity(entity, contextStack, true);
    if (!event) return undefined;

    contextStack[entity.id] = event;

    event.start = entity.start;
    event.end = entity.end;
    event.title = entity.title;
    event.state = entity.state;
    event.location = { ...entity.location };
    event.meta = entity.meta;
    event.price = entity.price;
    event.private = entity.private;
    event.regularEventInterval = entity.regularEventInterval;
    event.regularEvent = entity.regularEvent ? loadTenantScopedEntity(entity.regularEvent, contextStack) : null;
    event.supervisor = getEntityFromStackOrLoad(entity.supervisor, contextStack);
    event.eventApprovals = loadApply(entity.eventApprovals, (approval) =>
      loadTenantScopedEntity(approval, contextStack)
    );
    event.registrations = loadApply(entity.registrations, (registration) =>
      loadTenantScopedEntity(registration, contextStack)
    );
    event.tenant = tenant;

    return event;
  }

  if (entity instanceof ContentMaster) {
    if (entity.id in contextStack) return contextStack[entity.id];

    const contentMaster = loadTenantScopedEntity(entity, contextStack, true);
    if (!contentMaster) return undefined;

    contextStack[entity.id] = contentMaster;

    contentMaster.contentMasterKind = entity.contentMasterKind;
    contentMaster.slug = entity.slug;
    contentMaster.title = entity.title;
    contentMaster.tags = loadApply(entity.tags, (tag) => loadTenantScopedEntity(tag, contextStack));
    contentMaster.contributors = loadApply(entity.contributors, (contributor) =>
      getEntityFromStackOrLoad(contributor, contextStack)
    );
    contentMaster.tenant = tenant;
    contentMaster.rootContent = getEntityFromStackOrLoad(entity.rootContent, contextStack);

    return contentMaster;
  }

  if (entity instanceof TeamJoin && !loadBaseClass) {
    const baseJoin = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseJoin) return undefined;

    return {
      ...baseJoin,
      team: getEntityFromStackOrLoad(entity.team, contextStack),
      askedRole: loadTenantScopedEntity(entity.askedRole, contextStack),
      receivedRole: entity.receivedRole ? loadTenantScopedEntity(entity.receivedRole, contextStack) : null,
    };
  }

  if (entity instanceof EventJoin && !loadBaseClass) {
    const baseJoin = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseJoin) return undefined;

    return {
      ...baseJoin,
      presenceStatus: entity.presenceStatus,
      participated: entity.participated,
      linkedEvent: loadTenantScopedEntity(entity.event, contextStack),
      teamAction: entity.teamAction ? loadTenantScopedEntity(entity.teamAction, contextStack) : null,
    };
  }

  if (entity instanceof Join) {
    return {
      ...base,
      joinKind: entity.joinKind,
      state: entity.state,
      validatedAt: entity.validatedAt,
      validationMessage: entity.validationMessage,
      formSubmission: entity.formSubmission ? loadTenantScopedEntity(entity.formSubmission, contextStack) : null,
      validatedBy: getEntityFromStackOrLoad(entity.validatedBy, contextStack, true),
      issuer: getEntityFromStackOrLoad(entity.issuer, contextStack, true),
      joiner: getEntityFromStackOrLoad(entity.joiner, contextStack),
      tenant,
    };
  }

  if (entity instanceof TenantDocument && !loadBaseClass) {
    const baseUgc = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      name: entity.name,
      yearVersion: entity.yearVersion,
      documentUpload: loadTenantScopedEntity(entity.documentUpload, contextStack),
      edits: loadApply(entity.edits, (edit) => loadTenantScopedEntity(edit, contextStack)),
    };
  }

  if (entity instanceof DocumentEdit) {
    return {
      ...base,
      yearVersion: entity.yearVersion,
      documentUpload: loadTenantScopedEntity(entity.documentUpload, contextStack),
      editedBy: getEntityFromStackOrLoad(entity.editedBy, contextStack),
      tenant,
    };
  }

  if (entity instanceof Form && !loadBaseClass) {
    const baseUgc = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      name: entity.name,
      type: entity.type,
      schema: entity.schema,
      description: entity.description,
      isTemplate: entity.isTemplate,
    };
  }

  if (entity instanceof FormSubmission && !loadBaseClass) {
    const baseUgc = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      submission: entity.submission,
      forForm: loadTenantScopedEntity(entity.forForm, contextStack),
    };
  }

  if (entity instanceof Content && !loadBaseClass) {
    const baseUgc = loadTenantScopedEntity(entity, contextStack, true);
    if (!baseUgc) return undefined;

    return {
      ...baseUgc,
      parent: entity.parent ? loadTenantScopedEntity(entity, contextStack) : null,
      attachments: loadApply(entity.attachments, (attachment) => loadTenantScopedEntity(attachment, contextStack)),
    };
  }

  if (entity instanceof Ugc) {
    return {
      ...base,
      ugcKind: entity.ugcKind,
      text: entity.text,
      isAnonymous: entity.isAnonymous,
      contentMaster: getEntityFromStackOrLoad(entity.contentMaster, contextStack, true),
      author: getEntityFromStackOrLoad(entity.author, contextStack, true),
      representingOrg: getEntityFromStackOrLoad(entity.representingOrg, contextStack, true),
      tenant,
    };
  }

  if (entity instanceof EventApproval) {
    return {
      ...base,
      approved: entity.approved,
      message: entity.message,
      step: loadTenantScopedEntity(entity.step, contextStack),
      createdBy: getEntityFromStackOrLoad(entity.createdBy, contextStack),
      linkedEvent: loadTenantScopedEntity(entity.event, contextStack),
      tenant,
    };
  }

  if (entity instanceof EventApprovalStep) {
    return {
      ...base,
      order: entity.order,
      name: entity.name,
      notifiees: loadApply(entity.notifiees, (notifiee) => getEntityFromStackOrLoad(notifiee, contextStack)),
      validators: loadApply(entity.validators, (validator) => getEntityFromStackOrLoad(validator, contextStack)),
      tenantOrg: getEntityFromStackOrLoad(entity.tenantOrg, contextStack),
      createdBy: getEntityFromStackOrLoad(entity.createdBy, contextStack, true),
      tenant,
    };
  }

  throw new Error(`Unknown entity type ${entity.constructor.name}`);
}
