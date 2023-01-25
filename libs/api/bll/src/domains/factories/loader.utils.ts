import {
  Actor,
  ActorImage,
  BaseEntity,
  Bot,
  Content,
  ContentMaster,
  DocumentUpload,
  EventApproval,
  EventApprovalStep,
  EventJoin,
  FileUpload,
  Form,
  FormSubmission,
  ImageUpload,
  Individual,
  Join,
  Membership,
  Org,
  Role,
  Social,
  Tag,
  Team,
  TeamAction,
  TeamJoin,
  TeamMember,
  TeamRole,
  Tenant,
  TenantCore,
  TenantEvent,
  Ugc,
  User,
  UserProfile,
  VideoUpload,
} from '@okampus/api/dal';
import {
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
  IBaseEntity,
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
} from '@okampus/shared/dtos';
import {
  ActorKind,
  ContentMasterKind,
  FileUploadKind,
  IndividualKind,
  OrgKind,
  RoleKind,
  UgcKind,
} from '@okampus/shared/enums';
import { loadApply, loadEntityData } from '@okampus/api/shards';

export function loadBase(base: BaseEntity): IBaseEntity | undefined {
  return loadEntityData<BaseEntity, IBaseEntity>(base, (base) => ({
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

export function loadTag(tag: Tag): ITag | undefined {
  const base = loadBase(tag);
  if (!base) return undefined;

  return {
    ...base,
    color: tag.color,
    name: tag.name,
    description: tag.description,
    tenant: loadTenantCore(tag.tenant),
  };
}

export function loadSocial(social: Social, actor?: IActor): ISocial | undefined {
  const base = loadBase(social);
  if (!base) return undefined;

  return {
    ...base,
    type: social.type,
    url: social.url,
    pseudo: social.pseudo,
    actor: actor ?? loadActor(social.actor),
    tenant: loadTenantCore(social.tenant),
  };
}

export function loadBaseFileUpload(fileUpload: FileUpload): IFileUpload | undefined {
  const base = loadBase(fileUpload);
  if (!base) return undefined;

  return {
    ...base,
    fileUploadKind: fileUpload.fileUploadKind,
    url: fileUpload.url,
    mime: fileUpload.mime,
    name: fileUpload.name,
    size: fileUpload.size,
    lastModifiedAt: fileUpload.lastModifiedAt,
    tenant: loadTenantCore(fileUpload.tenant),
  };
}

export function loadImageUpload(imageUpload: ImageUpload): IImageUpload | undefined {
  const baseFileUpload = loadBaseFileUpload(imageUpload);
  if (!baseFileUpload) return undefined;

  return loadEntityData<ImageUpload, IImageUpload>(imageUpload, (imageUpload) => ({
    ...baseFileUpload,
    height: imageUpload.height,
    width: imageUpload.width,
  }));
}

export function loadDocumentUpload(documentUpload: DocumentUpload): IDocumentUpload | undefined {
  const baseFileUpload = loadBaseFileUpload(documentUpload);
  if (!baseFileUpload) return undefined;

  return {
    ...baseFileUpload,
    numberOfPages: documentUpload.numberOfPages,
    numberOfWords: documentUpload.numberOfWords,
    documentType: documentUpload.documentType,
  };
}

export function loadVideoUpload(videoUpload: VideoUpload): IVideoUpload | undefined {
  const baseFileUpload = loadBaseFileUpload(videoUpload);
  if (!baseFileUpload) return undefined;

  return {
    ...baseFileUpload,
    duration: videoUpload.duration,
    height: videoUpload.height,
    width: videoUpload.width,
  };
}

export function loadFileUpload(fileUpload: FileUpload): IFileUpload | undefined {
  switch (fileUpload.fileUploadKind) {
    case FileUploadKind.ImageUpload: {
      return loadImageUpload(fileUpload as ImageUpload);
    }
    case FileUploadKind.DocumentUpload: {
      return loadDocumentUpload(fileUpload as DocumentUpload);
    }
    case FileUploadKind.VideoUpload: {
      return loadVideoUpload(fileUpload as VideoUpload);
    }
    default: {
      return undefined;
    }
  }
}

export function loadActorImage(
  actorImage: ActorImage,
  actor?: IActor,
  org?: ITenant | ITeam,
  individual?: IUser | IBot
): IActorImage | undefined {
  const base = loadBase(actorImage);
  if (!base) return undefined;

  const tenant = loadTenantCore(actorImage.tenant);
  return {
    ...base,
    lastActiveDate: actorImage.lastActiveDate,
    type: actorImage.type,
    image: loadImageUpload(actorImage.image),
    actor: actor ?? loadActor(actorImage.actor, tenant, org, individual),
    tenant,
  };
}

export function loadUserProfile(userProfile: UserProfile): IUserProfile | undefined {
  const base = loadBase(userProfile);
  if (!base) return undefined;

  return {
    ...base,
    customization: { ...userProfile.customization },
    settings: { ...userProfile.settings },
    stats: { ...userProfile.stats },
    notificationSettings: { ...userProfile.notificationSettings },
    finishedIntroduction: userProfile.finishedIntroduction,
    finishedOnboarding: userProfile.finishedOnboarding,
    tenant: loadTenantCore(userProfile.tenant),
  };
}

export function loadBaseIndividual(
  individual: Individual,
  tenant?: ITenantCore,
  actor?: IActor
): IIndividual | undefined {
  const base = loadBase(individual);
  if (!base) return undefined;

  const loadedIndividual = {
    ...base,
    individualKind: individual.individualKind,
    tenant: tenant ?? loadTenantCore(individual.tenant),
  } as IUser | IBot;

  loadedIndividual.actor = actor ?? loadActor(individual.actor, loadedIndividual.tenant, undefined, loadedIndividual);
  return loadedIndividual;
}

export function loadUser(user: User, actor?: IActor): IUser | undefined {
  const tenant = loadTenantCore(user.tenant);
  const baseIndividual = loadBaseIndividual(user, tenant, actor);
  if (!baseIndividual) return undefined;

  return {
    ...baseIndividual,
    firstName: user.firstName,
    lastName: user.lastName,
    middleNames: user.middleNames,
    scopeRole: user.scopeRole,
    roles: user.roles,
    profile: loadUserProfile(user.profile),
  };
}

export function loadBot(bot: Bot, actor?: IActor): IBot | undefined {
  const tenant = loadTenantCore(bot.tenant);
  const baseIndividual = loadBaseIndividual(bot, tenant, actor);
  if (!baseIndividual) return undefined;

  return {
    ...baseIndividual,
    individualKind: IndividualKind.Bot,
    botRole: bot.botRole,
    owner: loadActor(bot.owner),
    actor: loadActor(bot.actor),
    tenant: loadTenantCore(bot.tenant),
  };
}

export function loadIndividual(individual: Individual, actor?: IActor): IUser | IBot | undefined {
  switch (individual.individualKind) {
    case IndividualKind.User: {
      return loadUser(individual as User, actor);
    }
    case IndividualKind.Bot: {
      return loadBot(individual as Bot, actor);
    }
    default: {
      return undefined;
    }
  }
}

export function loadBaseOrg(org: Org, tenant?: ITenantCore): IOrg | undefined {
  const base = loadBase(org);
  if (!base) return undefined;

  const loadedOrg = {
    ...base,
    orgKind: org.orgKind,
    parent: org.parent ? loadOrg(org.parent) : null,
    tenant: tenant ?? loadTenantCore(org.tenant),
  } as ITenant | ITeam;

  loadedOrg.actor = loadActor(org.actor, loadedOrg.tenant, loadedOrg);
  return loadedOrg;
}

export function loadTenant(tenantOrg: Tenant): ITenant | undefined {
  const coreTenant = loadTenantCore(tenantOrg.tenant);
  const baseOrg = loadBaseOrg(tenantOrg, coreTenant);
  if (!baseOrg) return undefined;

  return {
    ...baseOrg,
    orgKind: OrgKind.Tenant,
    eventApprovalSteps: loadApply(tenantOrg.eventApprovalSteps, loadEventApprovalStep),
    eventValidationForm: tenantOrg.eventValidationForm ? loadForm(tenantOrg.eventValidationForm) : null,
  };
}

export function loadTeam(team: Team): ITeam | undefined {
  const tenant = loadTenantCore(team.tenant);
  const baseOrg = loadBaseOrg(team, tenant);
  if (!baseOrg) return undefined;

  return {
    ...baseOrg,
    orgKind: OrgKind.Tenant,
    tagline: team.tagline,
    type: team.type,
    memberCount: team.memberCount,
    directorsCategoryName: team.directorsCategoryName,
    managersCategoryName: team.managersCategoryName,
    membersCategoryName: team.membersCategoryName,
    membershipFees: team.membershipFees,
    members: loadApply(team.members, loadTeamMember),
    joinForm: team.joinForm ? loadForm(team.joinForm) : null,
  };
}

export function loadOrg(org: Org): ITenant | ITeam | undefined {
  switch (org.orgKind) {
    case OrgKind.Tenant: {
      return loadTenant(org as Tenant);
    }
    case OrgKind.Team: {
      return loadTeam(org as Team);
    }
    default: {
      return undefined;
    }
  }
}

export function loadActor(
  actor: Actor,
  tenant?: ITenantCore,
  org?: ITenant | ITeam,
  individual?: IBot | IUser
): IActor | undefined {
  const base = loadBase(actor);
  if (!base) return undefined;

  const loadedActor = {
    ...base,
    name: actor.name,
    ical: actor.ical,
    bio: actor.bio,
    primaryEmail: actor.primaryEmail,
    slug: actor.slug,
    tags: actor.tags ? loadApply(actor.tags, loadTag) : [],
    individual: undefined,
    org: undefined,
    actorKind: actor.actorKind(),
    actorImages: [],
    socials: [],
    tenant: tenant ?? loadTenantCore(actor.tenant),
  } as IActor;

  loadedActor.actorImages = loadApply(actor.actorImages, (actorImage) => loadActorImage(actorImage, loadedActor));
  loadedActor.socials = loadApply(actor.socials, (social) => loadSocial(social, loadedActor));

  if (loadedActor.actorKind === ActorKind.Individual) {
    // Individual
    loadedActor.individual = individual ?? loadIndividual(actor.individual as Individual, loadedActor);
  } else if (loadedActor.actorKind === ActorKind.Org) {
    // Org
    loadedActor.org = org ?? loadOrg(actor.org as Org);
  }

  return loadedActor;
}

export function loadBaseRole(role: Role): IRole | undefined {
  const base = loadBase(role);
  if (!base) return undefined;

  return {
    ...base,
    roleKind: role.roleKind,
    color: role.color,
    required: role.required,
    name: role.name,
    tenant: loadTenantCore(role.tenant),
  };
}

export function loadTeamRole(teamRole: TeamRole): ITeamRole | undefined {
  const base = loadBase(teamRole);
  if (!base) return undefined;

  return {
    ...base,
    roleKind: RoleKind.TeamRole,
    category: teamRole.category,
    color: teamRole.color,
    required: teamRole.required,
    name: teamRole.name,
    permissions: teamRole.permissions,
    team: loadTeam(teamRole.team),
    tenant: loadTenantCore(teamRole.tenant),
  };
}

export function loadBaseMembership(membership: Membership): IMembership | undefined {
  const base = loadBase(membership);
  if (!base) return undefined;

  return {
    ...base,
    membershipKind: membership.membershipKind,
    startDate: membership.startDate,
    endDate: membership.endDate,
    user: loadUser(membership.user),
    tenant: loadTenantCore(membership.tenant),
  };
}

export function loadTeamMember(teamMember: TeamMember): ITeamMember | undefined {
  const baseMembership = loadBaseMembership(teamMember);
  if (!baseMembership) return undefined;

  return {
    ...baseMembership,
    role: loadTeamRole(teamMember.role),
    team: loadTeam(teamMember.team),
    activities: loadApply(teamMember.activities, loadTeamAction),
  };
}

export function loadTeamAction(teamAction: TeamAction): ITeamAction | undefined {
  const base = loadBase(teamAction);
  if (!base) return undefined;

  return loadEntityData<TeamAction, ITeamAction>(teamAction, (teamAction) => ({
    ...base,
    name: teamAction.name,
    score: teamAction.score,
    description: teamAction.description,
    team: loadTeam(teamAction.team),
    tenant: loadTenantCore(teamAction.tenant),
  }));
}

export function loadBaseContentMaster(contentMaster: ContentMaster): IContentMaster | undefined {
  const base = loadBase(contentMaster);
  if (!base) return undefined;

  return {
    ...base,
    contentMasterKind: contentMaster.contentMasterKind,
    title: contentMaster.title,
    tags: loadApply(contentMaster.tags, loadTag),
    contributors: loadApply(contentMaster.contributors, loadIndividual),

    tenant: loadTenantCore(contentMaster.tenant),
  };
}

export function loadEvent(event: TenantEvent): ITenantEvent | undefined {
  const baseMaster = loadBaseContentMaster(event);
  if (!baseMaster) return undefined;

  return {
    ...baseMaster,
    contentMasterKind: ContentMasterKind.TenantEvent,
    start: event.start,
    end: event.end,
    title: event.title,
    state: event.state,
    location: { ...event.location },
    meta: event.meta,
    price: event.price,
    private: event.private,
    regularEventInterval: event.regularEventInterval,
    regularEvent: event.regularEvent ? loadEvent(event.regularEvent) : null,
    supervisor: loadUser(event.supervisor),
    tags: loadApply(event.tags, loadTag),
    contributors: loadApply(event.contributors, loadIndividual),
    eventApprovals: loadApply(event.eventApprovals, loadEventApproval),
    registrations: loadApply(event.registrations, loadEventJoin),
  };
}

export function loadContentMaster(master: ContentMaster): IContentMaster | undefined {
  switch (master.contentMasterKind) {
    case ContentMasterKind.TenantEvent: {
      return loadEvent(master as TenantEvent);
    }
    default: {
      return undefined;
    }
  }
}

export function loadBaseJoin(join: Join): IJoin | undefined {
  const base = loadBase(join);
  if (!base) return undefined;

  return {
    ...base,
    joinKind: join.joinKind,
    state: join.state,
    validatedAt: join.validatedAt,
    validationMessage: join.validationMessage,
    formSubmission: join.formSubmission ? loadFormSubmission(join.formSubmission) : null,
    validatedBy: join.validatedBy ? loadIndividual(join.validatedBy) : null,
    issuer: join.issuer ? loadIndividual(join.issuer) : null,
    joiner: loadUser(join.joiner),
    tenant: loadTenantCore(join.tenant),
  };
}

export function loadTeamJoin(join: TeamJoin): ITeamJoin | undefined {
  const baseJoin = loadBaseJoin(join);
  if (!baseJoin) return undefined;

  return {
    ...baseJoin,
    team: loadTeam(join.team),
    askedRole: loadTeamRole(join.askedRole),
    receivedRole: join.receivedRole ? loadTeamRole(join.receivedRole) : null,
  };
}

export function loadEventJoin(join: EventJoin): IEventJoin | undefined {
  const baseJoin = loadBaseJoin(join);
  if (!baseJoin) return undefined;

  return {
    ...baseJoin,
    presenceStatus: join.presenceStatus,
    participated: join.participated,
    event: loadEvent(join.event),
    teamAction: join.teamAction ? loadTeamAction(join.teamAction) : null,
  };
}

export function loadBaseUgc(ugc: Ugc, org?: IOrg | null, master?: IContentMaster | null): IUgc | undefined {
  const base = loadBase(ugc);
  if (!base) return undefined;

  return {
    ...base,
    ugcKind: ugc.ugcKind,
    isAnonymous: ugc.isAnonymous,
    contentMaster: master ?? (ugc.contentMaster ? loadContentMaster(ugc.contentMaster) : null),
    author: loadIndividual(ugc.author),
    org: org ?? (ugc.org ? loadOrg(ugc.org) : null),
    tenant: loadTenantCore(ugc.tenant),
  };
}

export function loadForm(form: Form, org?: IOrg | null, master?: IContentMaster | null): IForm | undefined {
  const baseUgc = loadBaseUgc(form, org, master);
  if (!baseUgc) return undefined;

  return {
    ...baseUgc,
    name: form.name,
    type: form.type,
    schema: form.schema,
    description: form.description,
    isTemplate: form.isTemplate,
  };
}

export function loadFormSubmission(
  submission: FormSubmission,
  org?: IOrg | null,
  master?: IContentMaster | null
): IFormSubmission | undefined {
  const baseUgc = loadBaseUgc(submission, org, master);
  if (!baseUgc) return undefined;

  return {
    ...baseUgc,
    submission: submission.submission,
    forForm: loadForm(submission.forForm),
  };
}

export function loadContent(
  content: Content,
  org?: IOrg | null,
  contentMaster?: IContentMaster | null
): IContent | undefined {
  const baseUgc = loadBaseUgc(content, org, contentMaster);
  if (!baseUgc) return undefined;

  return {
    ...baseUgc,
    text: content.text,
    parent: content.parent ? loadUgc(content.parent) : null,
    attachments: loadApply(content.attachments, loadFileUpload),
  };
}

export function loadUgc(ugc: Ugc, org?: IOrg | null, contentMaster?: IContentMaster | null): IUgc | undefined {
  switch (ugc.ugcKind) {
    case UgcKind.Form: {
      return loadForm(ugc as Form, org, contentMaster);
    }
    case UgcKind.FormSubmission: {
      return loadFormSubmission(ugc as FormSubmission, org, contentMaster);
    }
    case UgcKind.Content: {
      return loadContent(ugc as Content, org, contentMaster);
    }
    default: {
      return undefined;
    }
  }
}

export function loadEventApproval(approval: EventApproval): IEventApproval | undefined {
  const base = loadBase(approval);
  if (!base) return undefined;

  return {
    ...base,
    approved: approval.approved,
    message: approval.message,
    step: loadEventApprovalStep(approval.step),
    createdBy: loadIndividual(approval.createdBy),
    event: loadEvent(approval.event),
    tenant: loadTenantCore(approval.tenant),
  };
}

export function loadEventApprovalStep(step: EventApprovalStep, tenant?: ITenant): IEventApprovalStep | undefined {
  const base = loadBase(step);
  if (!base) return undefined;

  return {
    ...base,
    order: step.order,
    name: step.name,
    notifiees: loadApply(step.notifiees, loadUser),
    validators: loadApply(step.validators, loadIndividual),
    tenantOrg: tenant ?? loadTenant(step.tenantOrg),
    createdBy: loadIndividual(step.createdBy),
    tenant: loadTenantCore(step.tenant),
  };
}
